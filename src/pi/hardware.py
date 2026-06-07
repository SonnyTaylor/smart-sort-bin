"""
AI Smart Bin - Raspberry Pi Hardware Layer

Real hardware control for:
- USB webcam (fswebcam — reliable on Pi 3B)
- Pan/tilt servos (pigpio - hardware timed PWM, no jitter)
- WS2812B LED ring (optional, not connected yet)
- Face tracking (OpenCV Haar cascades)
"""

import os
import time
import threading
import subprocess
import logging
import io

log = logging.getLogger(__name__)

# Servos - pigpio for hardware-timed PWM (no jitter)
try:
    import pigpio
    HAS_PIGPIO = True
except Exception:
    HAS_PIGPIO = False

# OpenCV for face detection
try:
    import cv2
    import numpy as np
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False
    log.warning("cv2 not available — face tracking disabled")

# Pin config
PAN_PIN = 17
TILT_PIN = 27
LED_PIN = 18
LED_COUNT = 16

# pigpio pulsewidth range for servos: 500-2500us
# Map -1..1 to 500..2500, with 1500 as center
def _val_to_pw(value):
    return int(1500 + (value * 1000))

def _pw_to_val(pw):
    return round((pw - 1500) / 1000, 2)

# Bin presets — pan to the correct third, then tilt to dump
# Bin layout (top view): [ GENERAL | RECYCLING | COMPOST ]
#                        pan -1    pan 0       pan +1
#
# Tilt: 0.0 = horizontal (rest), -1.0 = fully tipped (dump)
CATEGORY_PRESETS = {
    "general":   {"pan": -0.7, "tilt_dump": -0.6, "tilt_rest": 0.0},
    "recycling": {"pan":  0.0, "tilt_dump": -0.6, "tilt_rest": 0.0},
    "compost":   {"pan":  0.7, "tilt_dump": -0.6, "tilt_rest": 0.0},
}

# Timing
SORT_PAN_SETTLE_S = 0.5   # Wait for pan to reach position
SORT_DUMP_HOLD_S  = 1.0   # Hold tilt to let item fall
SORT_RETURN_S     = 0.5   # Wait for tilt to return

LED_COLORS = {
    "off": (0, 0, 0),
    "white": (32, 32, 32),
    "red": (255, 0, 0),
    "yellow": (255, 180, 0),
    "green": (0, 255, 0),
    "blue": (0, 0, 255),
    "purple": (128, 0, 128),
}


class Camera:
    """USB webcam capture using v4l2-ctl with mmap streaming.

    Keeps the camera device open for continuous frames and stable auto-exposure.
    """

    def __init__(self, device=0, width=640, height=480):
        self.width = width
        self.height = height
        self.device = device
        self._last_jpeg = None
        self._last_time = 0
        self._running = False
        self._process = None
        self._lock = threading.Lock()
        log.info(f"Camera: v4l2 mmap mode (device {device}, {width}x{height})")
        self._start_stream()

    def _start_stream(self):
        """Start v4l2-ctl mmap stream that keeps device open."""
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._stream_loop, daemon=True)
        self._thread.start()
        log.info("Camera: v4l2 stream started")

    def _stream_loop(self):
        """Run v4l2-ctl --stream-mmap and parse JPEG frames from output."""
        cmd = [
            "v4l2-ctl",
            f"--device=/dev/video{self.device}",
            f"--set-fmt-video=width={self.width},height={self.height},pixelformat=MJPG",
            "--stream-mmap",
            "--stream-count=-1",
            "--stream-to=-",
        ]

        while self._running:
            try:
                log.info("Camera: starting v4l2 stream...")
                proc = subprocess.Popen(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                )
                self._process = proc

                # Read JPEG frames from stdout
                # JPEG files start with FF D8 and end with FF D9
                buffer = b""
                warmup = 5  # Skip first few frames for auto-exposure
                frame_count = 0

                while self._running and proc.poll() is None:
                    chunk = proc.stdout.read(4096)
                    if not chunk:
                        break
                    buffer += chunk

                    # Find JPEG frames in buffer
                    while True:
                        # Look for JPEG start marker
                        start = buffer.find(b"\xff\xd8")
                        if start == -1:
                            buffer = b""
                            break

                        # Look for JPEG end marker after start
                        end = buffer.find(b"\xff\xd9", start + 2)
                        if end == -1:
                            # Keep from start onwards, might be incomplete
                            buffer = buffer[start:]
                            break

                        # Extract complete JPEG frame
                        jpeg = buffer[start:end + 2]
                        buffer = buffer[end + 2:]

                        frame_count += 1
                        if frame_count == warmup + 1:
                            log.info(f"Camera: warmup complete, serving frames ({len(jpeg)} bytes)")
                        if frame_count > warmup:
                            with self._lock:
                                self._last_jpeg = jpeg
                                self._last_time = time.time()

                log.warning("Camera: v4l2 stream ended")

            except FileNotFoundError:
                log.error("v4l2-ctl not installed")
                self._running = False
                break
            except Exception as e:
                log.error(f"Camera stream error: {e}")

            if self._running:
                time.sleep(2)  # Wait before retry

    def get_jpeg_bytes(self):
        """Return latest captured frame (non-blocking)."""
        with self._lock:
            return self._last_jpeg

    def get_jpeg(self):
        """Alias for get_jpeg_bytes (compatibility with old code)."""
        return self.get_jpeg_bytes()

    def stop(self):
        self._running = False
        if self._process:
            try:
                self._process.terminate()
            except Exception:
                pass
        if hasattr(self, '_thread') and self._thread:
            self._thread.join(timeout=3)


class PIDController:
    """Simple PID controller with anti-windup."""

    def __init__(self, kp=1.0, ki=0.0, kd=0.0, output_limit=1.0):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.output_limit = output_limit
        self._integral = 0.0
        self._prev_error = 0.0
        self._prev_time = time.time()

    def update(self, error):
        now = time.time()
        dt = now - self._prev_time
        if dt <= 0:
            dt = 0.01
        self._prev_time = now

        # Proportional
        p = self.kp * error

        # Integral with anti-windup clamp
        self._integral += error * dt
        self._integral = max(-self.output_limit, min(self.output_limit, self._integral))
        i = self.ki * self._integral

        # Derivative (on error, not measurement — simple approach)
        derivative = (error - self._prev_error) / dt
        d = self.kd * derivative
        self._prev_error = error

        output = p + i + d
        return max(-self.output_limit, min(self.output_limit, output))

    def reset(self):
        self._integral = 0.0
        self._prev_error = 0.0
        self._prev_time = time.time()


class FaceTracker:
    """Face detection and servo tracking with PID control.

    Features:
    - PID controller for smooth, fast, non-oscillating tracking
    - Variable gain (fast when far, slow when close)
    - ROI (Region of Interest) for faster detection after initial find
    - Haar cascade face detection
    """

    def __init__(self, camera, pan_setter, tilt_setter):
        self.camera = camera
        self._set_pan = pan_setter
        self._set_tilt = tilt_setter
        self._running = False
        self._thread = None
        self._lock = threading.Lock()

        # Tracking state
        self.face_detected = False
        self.face_x = 0.0  # -1 (left) to 1 (right)
        self.face_y = 0.0  # -1 (top) to 1 (bottom)
        self.face_w = 0
        self.face_h = 0
        self.face_box = None  # (x, y, w, h) in pixel coords

        # PID controllers (one per axis)
        # Kp: proportional gain (how fast to chase)
        # Ki: integral gain (eliminate steady-state drift)
        # Kd: derivative gain (dampen oscillation)
        self._pid_pan = PIDController(kp=1.5, ki=0.1, kd=0.8, output_limit=1.0)
        self._pid_tilt = PIDController(kp=1.5, ki=0.1, kd=0.8, output_limit=1.0)

        # Tuning (user-adjustable)
        self.tracking_speed = 0.5   # Master speed multiplier (0.1–1.0)
        self.deadzone = 0.04        # Ignore small offsets (normalized)

        # ROI tracking
        self._roi = None  # (x, y, w, h) in pixels — search region
        self._roi_padding = 1.5  # Expand ROI by this factor

        # Timing
        self._last_detect_time = 0
        self._detect_interval = 0.05  # Seconds between detections (~20fps)

        # Load cascade
        self._cascade = None
        if HAS_CV2:
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            if os.path.exists(cascade_path):
                self._cascade = cv2.CascadeClassifier(cascade_path)
                log.info(f"FaceTracker: cascade loaded ({cascade_path})")
            else:
                log.error(f"FaceTracker: cascade not found at {cascade_path}")
        else:
            log.warning("FaceTracker: cv2 not available")

    @property
    def available(self):
        return self._cascade is not None

    @property
    def active(self):
        return self._running

    def start(self):
        if not self.available:
            log.error("FaceTracker: cannot start — cascade not loaded")
            return False
        if self._running:
            return True
        self._running = True
        self._roi = None
        self._pid_pan.reset()
        self._pid_tilt.reset()
        self._thread = threading.Thread(target=self._track_loop, daemon=True)
        self._thread.start()
        log.info("FaceTracker: started (PID mode)")
        return True

    def stop(self):
        self._running = False
        self.face_detected = False
        self.face_box = None
        self._roi = None
        if self._thread:
            self._thread.join(timeout=3)
            self._thread = None
        log.info("FaceTracker: stopped")

    def _detect_faces(self, gray, roi=None):
        """Detect faces, optionally within a ROI for speed."""
        if roi is not None:
            rx, ry, rw, rh = roi
            # Clamp ROI to frame bounds
            h, w = gray.shape
            rx = max(0, rx)
            ry = max(0, ry)
            rw = min(w - rx, rw)
            rh = min(h - ry, rh)
            if rw < 40 or rh < 40:
                roi = None  # ROI too small, search full frame

        if roi is not None:
            rx, ry, rw, rh = roi
            crop = gray[ry:ry+rh, rx:rx+rw]
            faces = self._cascade.detectMultiScale(
                crop,
                scaleFactor=1.05,
                minNeighbors=4,
                minSize=(40, 40),
            )
            # Offset detections back to full-frame coords
            if len(faces) > 0:
                faces = [(x + rx, y + ry, w, h) for (x, y, w, h) in faces]
            return faces
        else:
            # Full frame search
            return self._cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(50, 50),
            )

    def _make_roi(self, face_box, frame_shape):
        """Create an expanded ROI around a detected face."""
        x, y, w, h = face_box
        fh, fw = frame_shape
        pad = self._roi_padding

        cx = x + w / 2
        cy = y + h / 2
        new_w = w * pad * 2
        new_h = h * pad * 2

        rx = int(cx - new_w / 2)
        ry = int(cy - new_h / 2)
        rw = int(new_w)
        rh = int(new_h)

        # Clamp to frame
        rx = max(0, rx)
        ry = max(0, ry)
        rw = min(fw - rx, rw)
        rh = min(fh - ry, rh)

        return (rx, ry, rw, rh)

    def _track_loop(self):
        """Main tracking loop with PID control and ROI."""
        frames_lost = 0
        dt = 0.033  # ~30fps

        while self._running:
            try:
                loop_start = time.time()

                # Get latest frame
                jpeg = self.camera.get_jpeg_bytes()
                if not jpeg:
                    time.sleep(0.05)
                    continue

                # Decode to grayscale
                nparr = np.frombuffer(jpeg, np.uint8)
                gray = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
                if gray is None:
                    time.sleep(0.02)
                    continue

                h, w = gray.shape

                # Rate limit detection
                now = time.time()
                if now - self._last_detect_time < self._detect_interval:
                    # Between detections, keep applying last known error
                    if self.face_detected:
                        self._apply_pid()
                    time.sleep(0.01)
                    continue

                self._last_detect_time = now

                # Detect faces (with ROI if we had a recent detection)
                faces = self._detect_faces(gray, self._roi if self.face_detected else None)

                with self._lock:
                    if len(faces) > 0:
                        # Track largest face
                        x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])
                        frames_lost = 0

                        # Normalized coords (-1 to 1)
                        cx = (x + fw / 2) / w * 2 - 1
                        cy = (y + fh / 2) / h * 2 - 1

                        self.face_detected = True
                        self.face_x = cx
                        self.face_y = cy
                        self.face_w = fw
                        self.face_h = fh
                        self.face_box = (int(x), int(y), int(fw), int(fh))

                        # Update ROI for next frame
                        self._roi = self._make_roi(self.face_box, (h, w))

                        # Log
                        if frames_lost > 0:
                            log.info(f"FaceTracker: face re-acquired after {frames_lost} frames")
                    else:
                        frames_lost += 1
                        # Expand ROI search area gradually when face is lost
                        if self._roi and frames_lost < 10:
                            rx, ry, rw, rh = self._roi
                            expand = frames_lost * 20
                            self._roi = (max(0, rx - expand), max(0, ry - expand),
                                         rw + expand * 2, rh + expand * 2)
                        else:
                            # Lost completely — search full frame
                            self._roi = None
                            if self.face_detected:
                                self.face_detected = False
                                self.face_box = None
                                self._pid_pan.reset()
                                self._pid_tilt.reset()
                                log.info("FaceTracker: face lost")

                # Apply PID control
                self._apply_pid()

                # Maintain loop timing
                elapsed = time.time() - loop_start
                sleep_time = max(0.01, dt - elapsed)
                time.sleep(sleep_time)

            except Exception as e:
                log.error(f"FaceTracker error: {e}")
                time.sleep(0.3)

    def _apply_pid(self):
        """Apply PID control to move servos toward face."""
        if not self.face_detected:
            return

        error_x = self.face_x
        error_y = self.face_y

        # Apply deadzone
        if abs(error_x) < self.deadzone:
            error_x = 0
        if abs(error_y) < self.deadzone:
            error_y = 0

        if error_x == 0 and error_y == 0:
            return

        # Get PID output
        speed = self.tracking_speed
        pan_output = self._pid_pan.update(error_x) * speed
        tilt_output = self._pid_tilt.update(error_y) * speed

        # Get current position
        current_pan = getattr(self.camera, '_hw_pan', 0.0)
        current_tilt = getattr(self.camera, '_hw_tilt', 0.0)

        # Move servos (invert pan because camera is mirrored)
        new_pan = current_pan - pan_output * 0.06
        new_tilt = current_tilt - tilt_output * 0.06

        new_pan = max(-1.0, min(1.0, new_pan))
        new_tilt = max(-1.0, min(1.0, new_tilt))

        self._set_pan(new_pan)
        self._set_tilt(new_tilt)

    def get_status(self):
        with self._lock:
            return {
                "active": self._running,
                "face_detected": self.face_detected,
                "face_x": round(self.face_x, 3),
                "face_y": round(self.face_y, 3),
                "face_w": self.face_w,
                "face_h": self.face_h,
                "tracking_speed": self.tracking_speed,
                "deadzone": self.deadzone,
                "kp": self._pid_pan.kp,
                "ki": self._pid_pan.ki,
                "kd": self._pid_pan.kd,
                "available": self.available,
                "roi_active": self._roi is not None,
            }

    def get_face_box(self):
        """Get current face bounding box in pixel coords (x, y, w, h)."""
        with self._lock:
            return self.face_box


class LEDController:
    """WS2812B LED ring control. (Not connected yet — no-op)."""

    def __init__(self, count=LED_COUNT, pin=LED_PIN):
        self.strip = None
        # rpi_ws281x not installed — LED ring not connected yet

    def set_color(self, r, g, b):
        pass  # No-op until LED ring is wired

    def clear(self):
        pass


class Hardware:
    """Main hardware interface using pigpio for servos."""

    def __init__(self):
        self.camera = Camera()
        self.camera._hw_pan = 0.0  # Let face tracker read current pos
        self.camera._hw_tilt = 0.0
        self.led = LEDController()

        self._pi = None
        self._pan_val = 0.0
        self._tilt_val = 0.0

        if HAS_PIGPIO:
            try:
                self._pi = pigpio.pi()
                if self._pi.connected:
                    self._pi.set_servo_pulsewidth(PAN_PIN, _val_to_pw(0))
                    self._pi.set_servo_pulsewidth(TILT_PIN, _val_to_pw(0))
                    self._pan_val = 0.0
                    self._tilt_val = 0.0
                    log.info("pigpio connected, servos centered")
                else:
                    self._pi = None
                    log.warning("pigpio not connected — servos disabled")
            except Exception as e:
                log.warning(f"pigpio init failed: {e}")
                self._pi = None

        # Face tracker (init after camera and servos)
        self.face_tracker = FaceTracker(self.camera, self.set_pan, self.set_tilt)

    # --- Servos ---

    def set_pan(self, value):
        """value: -1.0 to 1.0"""
        value = max(-1.0, min(1.0, float(value)))
        self._pan_val = value
        self.camera._hw_pan = value  # Track for face tracker
        if self._pi:
            self._pi.set_servo_pulsewidth(PAN_PIN, _val_to_pw(value))

    def set_tilt(self, value):
        """value: -1.0 to 1.0"""
        value = max(-1.0, min(1.0, float(value)))
        self._tilt_val = value
        self.camera._hw_tilt = value  # Track for face tracker
        if self._pi:
            self._pi.set_servo_pulsewidth(TILT_PIN, _val_to_pw(value))

    def move_to_category(self, category):
        """Full sort sequence: pan to bin third, dump, return home."""
        preset = CATEGORY_PRESETS.get(category)
        if not preset:
            return
        # Step 1: Pan to the correct third
        self.set_pan(preset["pan"])
        time.sleep(SORT_PAN_SETTLE_S)
        # Step 2: Tilt to dump
        self.set_tilt(preset["tilt_dump"])
        time.sleep(SORT_DUMP_HOLD_S)
        # Step 3: Return tilt to rest
        self.set_tilt(preset["tilt_rest"])
        time.sleep(SORT_RETURN_S)
        # Step 4: Pan back to center
        self.set_pan(0.0)
        time.sleep(SORT_PAN_SETTLE_S)

    def dump_only(self, category):
        """Just tilt to dump (assumes already panned)."""
        preset = CATEGORY_PRESETS.get(category)
        if not preset:
            return
        self.set_tilt(preset["tilt_dump"])
        time.sleep(SORT_DUMP_HOLD_S)
        self.set_tilt(preset["tilt_rest"])
        time.sleep(SORT_RETURN_S)

    def center_servos(self):
        self.set_pan(0)
        self.set_tilt(0)
        time.sleep(0.5)
        if self._pi:
            self._pi.set_servo_pulsewidth(PAN_PIN, 0)
            self._pi.set_servo_pulsewidth(TILT_PIN, 0)

    # --- Camera ---

    def capture_photo(self):
        return self.camera.get_jpeg_bytes()

    def get_camera_frame(self):
        jpeg = self.camera.get_jpeg()
        return {
            "available": jpeg is not None,
            "last_capture_time": time.time(),
        }

    def get_camera_jpeg_bytes(self):
        return self.camera.get_jpeg_bytes()

    # --- LED ---

    def set_led(self, color_name):
        r, g, b = LED_COLORS.get(color_name, (0, 0, 0))
        self.led.set_color(r, g, b)

    # --- Health ---

    def get_system_health(self):
        temp_c = 0.0
        try:
            with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
                temp_c = int(f.read().strip()) / 1000.0
        except Exception:
            pass

        uptime_s = 0.0
        try:
            with open("/proc/uptime", "r") as f:
                uptime_s = float(f.read().split()[0])
        except Exception:
            pass

        return {
            "cpu_temp_c": round(temp_c, 1),
            "uptime_seconds": round(uptime_s, 1),
            "inference_ms": 0,
            "uart_connected": self._pi is not None and self._pi.connected,
            "wifi_connected": True,
        }


# Singleton
_hw = None


def get_hw():
    global _hw
    if _hw is None:
        _hw = Hardware()
    return _hw


# Module-level helpers (same signature as mock_hardware)


def get_system_health():
    return get_hw().get_system_health()


def get_camera_frame():
    return get_hw().get_camera_frame()


def get_camera_jpeg_bytes():
    return get_hw().get_camera_jpeg_bytes()


def capture_photo():
    return get_hw().capture_photo()


def set_pan(value):
    get_hw().set_pan(value)


def set_tilt(value):
    get_hw().set_tilt(value)


def move_to_category(category):
    get_hw().move_to_category(category)


def dump_only(category):
    get_hw().dump_only(category)


def center_servos():
    get_hw().center_servos()


def set_led(color_name):
    get_hw().set_led(color_name)
