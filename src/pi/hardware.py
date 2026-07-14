"""
AI Smart Bin - Raspberry Pi Hardware Layer

Real hardware control for:
- USB webcam (v4l2 mmap streaming — reliable on Pi 3B)
- Pan/tilt servos (pigpio - hardware timed PWM, no jitter)
- WS2812B LED ring (optional, not connected yet)
"""

import time
import threading
import subprocess
import logging

log = logging.getLogger(__name__)

# Servos - pigpio for hardware-timed PWM (no jitter)
try:
    import pigpio
    HAS_PIGPIO = True
except Exception:
    HAS_PIGPIO = False

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
# Used as fallbacks; live values come from the calibration store (database).
CATEGORY_PRESETS = {
    "general":   {"pan": -0.7, "tilt_dump": -0.6, "tilt_rest": 0.0},
    "recycling": {"pan":  0.0, "tilt_dump": -0.6, "tilt_rest": 0.0},
    "compost":   {"pan":  0.7, "tilt_dump": -0.6, "tilt_rest": 0.0},
}

# Timing
SORT_PAN_SETTLE_S = 0.5   # Wait for pan to reach position
SORT_DUMP_HOLD_S  = 1.0   # Hold tilt to let item fall
SORT_RETURN_S     = 0.5   # Wait for tilt to return

# Servo motion smoothing (slew-rate limiting).
# Manual control used to jump the pulsewidth straight to the target, which
# snaps the servos. The motion thread instead steps toward the target at a
# bounded rate so every move is smooth regardless of input source.
SLEW_ENABLED = True
SLEW_RATE = 2.5        # units/second (-1..1 scale); full sweep -1 -> +1 in 0.8s
SLEW_TICK_HZ = 50      # motion thread update rate

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
    """Main hardware interface using pigpio for servos.

    Servo writes go through a slew-rate-limited motion thread: callers set a
    target and the thread walks the actual pulsewidth toward it at SLEW_RATE.
    Pass immediate=True to bypass smoothing (used by the animation engine,
    which generates its own fine-grained easing steps).
    """

    def __init__(self):
        self.camera = Camera()
        self.led = LEDController()

        self._pi = None
        self._pan_val = 0.0    # actual (last written) position
        self._tilt_val = 0.0
        self._pan_target = 0.0
        self._tilt_target = 0.0
        self._servo_lock = threading.Lock()

        if HAS_PIGPIO:
            try:
                self._pi = pigpio.pi()
                if self._pi.connected:
                    self._pi.set_servo_pulsewidth(PAN_PIN, _val_to_pw(0))
                    self._pi.set_servo_pulsewidth(TILT_PIN, _val_to_pw(0))
                    log.info("pigpio connected, servos centered")
                else:
                    self._pi = None
                    log.warning("pigpio not connected — servos disabled")
            except Exception as e:
                log.warning(f"pigpio init failed: {e}")
                self._pi = None

        if SLEW_ENABLED:
            self._motion_running = True
            self._motion_thread = threading.Thread(target=self._motion_loop, daemon=True)
            self._motion_thread.start()
            log.info(f"Servo motion thread started (slew {SLEW_RATE}/s @ {SLEW_TICK_HZ}Hz)")

    # --- Servos ---

    def _write_pan(self, value):
        self._pan_val = value
        if self._pi:
            self._pi.set_servo_pulsewidth(PAN_PIN, _val_to_pw(value))

    def _write_tilt(self, value):
        self._tilt_val = value
        if self._pi:
            self._pi.set_servo_pulsewidth(TILT_PIN, _val_to_pw(value))

    def _motion_loop(self):
        """Walk actual positions toward targets at a bounded rate."""
        tick = 1.0 / SLEW_TICK_HZ
        max_step = SLEW_RATE * tick
        while self._motion_running:
            with self._servo_lock:
                for axis in ("pan", "tilt"):
                    current = self._pan_val if axis == "pan" else self._tilt_val
                    target = self._pan_target if axis == "pan" else self._tilt_target
                    delta = target - current
                    if abs(delta) < 1e-4:
                        continue
                    step = max(-max_step, min(max_step, delta))
                    if axis == "pan":
                        self._write_pan(current + step)
                    else:
                        self._write_tilt(current + step)
            time.sleep(tick)

    def set_pan(self, value, immediate=False):
        """value: -1.0 to 1.0"""
        value = max(-1.0, min(1.0, float(value)))
        with self._servo_lock:
            self._pan_target = value
            if immediate or not SLEW_ENABLED:
                self._write_pan(value)

    def set_tilt(self, value, immediate=False):
        """value: -1.0 to 1.0"""
        value = max(-1.0, min(1.0, float(value)))
        with self._servo_lock:
            self._tilt_target = value
            if immediate or not SLEW_ENABLED:
                self._write_tilt(value)

    def get_position(self):
        """Current actual and target positions."""
        with self._servo_lock:
            return {
                "pan": round(self._pan_val, 3),
                "tilt": round(self._tilt_val, 3),
                "pan_target": round(self._pan_target, 3),
                "tilt_target": round(self._tilt_target, 3),
            }

    def move_to_category(self, category, presets=None, timing=None):
        """Full sort sequence: pan to bin third, dump, return home.

        presets/timing default to the hardcoded fallbacks; the web layer
        passes DB-backed calibration values.
        """
        preset = (presets or CATEGORY_PRESETS).get(category)
        if not preset:
            return
        t = timing or {}
        pan_settle = t.get("pan_settle_s", SORT_PAN_SETTLE_S)
        dump_hold = t.get("dump_hold_s", SORT_DUMP_HOLD_S)
        return_s = t.get("return_s", SORT_RETURN_S)

        # Step 1: Pan to the correct third
        self.set_pan(preset["pan"])
        time.sleep(pan_settle)
        # Step 2: Tilt to dump
        self.set_tilt(preset["tilt_dump"])
        time.sleep(dump_hold)
        # Step 3: Return tilt to rest
        self.set_tilt(preset.get("tilt_rest", 0.0))
        time.sleep(return_s)
        # Step 4: Pan back to center
        self.set_pan(0.0)
        time.sleep(pan_settle)

    def dump_only(self, category, presets=None, timing=None):
        """Just tilt to dump (assumes already panned)."""
        preset = (presets or CATEGORY_PRESETS).get(category)
        if not preset:
            return
        t = timing or {}
        self.set_tilt(preset["tilt_dump"])
        time.sleep(t.get("dump_hold_s", SORT_DUMP_HOLD_S))
        self.set_tilt(preset.get("tilt_rest", 0.0))
        time.sleep(t.get("return_s", SORT_RETURN_S))

    def center_servos(self):
        self.set_pan(0)
        self.set_tilt(0)
        # Give the slew time to finish before detaching (stops servo hum)
        time.sleep(1.0 if SLEW_ENABLED else 0.5)
        if self._pi:
            with self._servo_lock:
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


def set_pan(value, immediate=False):
    get_hw().set_pan(value, immediate=immediate)


def set_tilt(value, immediate=False):
    get_hw().set_tilt(value, immediate=immediate)


def get_position():
    return get_hw().get_position()


def move_to_category(category, presets=None, timing=None):
    get_hw().move_to_category(category, presets=presets, timing=timing)


def dump_only(category, presets=None, timing=None):
    get_hw().dump_only(category, presets=presets, timing=timing)


def center_servos():
    get_hw().center_servos()


def set_led(color_name):
    get_hw().set_led(color_name)
