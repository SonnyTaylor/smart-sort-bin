"""
AI Smart Bin - Raspberry Pi Hardware Layer

Real hardware control for:
- USB webcam (OpenCV preferred, fswebcam fallback)
- Pan/tilt servos (pigpio - hardware timed PWM, no jitter)
- WS2812B LED ring (rpi_ws281x, optional)
"""

import os
import time
import threading
import subprocess

# Servos - pigpio for hardware-timed PWM (no jitter)
try:
    import pigpio
    HAS_PIGPIO = True
except Exception:
    HAS_PIGPIO = False

# Camera
try:
    import cv2
    HAS_CV2 = True
except Exception:
    HAS_CV2 = False

# LED
try:
    from rpi_ws281x import PixelStrip, Color
    HAS_LED = True
except Exception:
    HAS_LED = False

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

# Bin presets (pan value: -1 to 1)
CATEGORY_PRESETS = {
    "general": -0.8,
    "recycling": 0.0,
    "compost": 0.8,
}

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
    """Threaded USB camera capture."""

    def __init__(self, device=0, width=640, height=480):
        self.width = width
        self.height = height
        self._cap = None
        self._frame = None
        self._running = False
        self._thread = None

        if HAS_CV2:
            self._cap = cv2.VideoCapture(device)
            if self._cap.isOpened():
                self._cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
                self._cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
                self._running = True
                self._thread = threading.Thread(target=self._loop, daemon=True)
                self._thread.start()
            else:
                self._cap = None

    def _loop(self):
        while self._running:
            ret, frame = self._cap.read()
            if ret:
                self._frame = frame
            time.sleep(0.005)

    def get_jpeg(self):
        """Return latest frame as JPEG bytes, or None."""
        if self._frame is not None and HAS_CV2:
            ret, buf = cv2.imencode(".jpg", self._frame)
            if ret:
                return buf.tobytes()
        return None

    def capture_fallback(self, path="/tmp/snapshot.jpg"):
        """Capture using fswebcam and return bytes."""
        subprocess.run(
            ["fswebcam", "-r", f"{self.width}x{self.height}", "--no-banner", path],
            capture_output=True,
        )
        with open(path, "rb") as f:
            return f.read()

    def get_jpeg_bytes(self):
        """Best-effort JPEG: OpenCV live frame, or fswebcam snapshot."""
        jpeg = self.get_jpeg()
        if jpeg:
            return jpeg
        return self.capture_fallback()

    def stop(self):
        self._running = False
        if self._thread:
            self._thread.join(timeout=1)
        if self._cap:
            self._cap.release()


class LEDController:
    """WS2812B LED ring control."""

    def __init__(self, count=LED_COUNT, pin=LED_PIN):
        self.strip = None
        if HAS_LED:
            try:
                self.strip = PixelStrip(
                    count, pin, 800000, 10, False, 64, 0, "WS2811_STRIP_GRB"
                )
                self.strip.begin()
                self.clear()
            except Exception:
                self.strip = None

    def set_color(self, r, g, b):
        if self.strip:
            for i in range(self.strip.numPixels()):
                self.strip.setPixelColor(i, Color(r, g, b))
            self.strip.show()

    def clear(self):
        self.set_color(0, 0, 0)


class Hardware:
    """Main hardware interface using pigpio for servos."""

    def __init__(self):
        self.camera = Camera()
        self.led = LEDController()

        self._pi = None
        self._pan_val = 0.0
        self._tilt_val = 0.0

        if HAS_PIGPIO:
            self._pi = pigpio.pi()
            if self._pi.connected:
                self._pi.set_servo_pulsewidth(PAN_PIN, _val_to_pw(0))
                self._pi.set_servo_pulsewidth(TILT_PIN, _val_to_pw(0))
                self._pan_val = 0.0
                self._tilt_val = 0.0
            else:
                self._pi = None

    # --- Servos ---

    def set_pan(self, value):
        """value: -1.0 to 1.0"""
        value = max(-1.0, min(1.0, float(value)))
        self._pan_val = value
        if self._pi:
            self._pi.set_servo_pulsewidth(PAN_PIN, _val_to_pw(value))

    def set_tilt(self, value):
        """value: -1.0 to 1.0"""
        value = max(-1.0, min(1.0, float(value)))
        self._tilt_val = value
        if self._pi:
            self._pi.set_servo_pulsewidth(TILT_PIN, _val_to_pw(value))

    def move_to_category(self, category):
        preset = CATEGORY_PRESETS.get(category, 0.0)
        self.set_pan(preset)

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
            "uart_connected": False,
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


def center_servos():
    get_hw().center_servos()


def set_led(color_name):
    get_hw().set_led(color_name)
