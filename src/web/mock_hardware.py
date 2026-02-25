"""
AI Smart Bin - Mock Hardware Layer

Simulates system health metrics so the dashboard can be
developed and tested without physical hardware connected.

Note: Mock auto-sort was removed — in mock mode the dashboard
shows an empty activity feed and static health placeholders.
"""

import base64
import random
import time

# Simulated system health
_start_time = time.time()
_mock_temp = 42.0

# 1x1 transparent JPEG or similar placeholder
# We use a solid gray 10x10 JPEG for mock camera stream
_MOCK_JPEG_B64 = (
    "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP////////////////////////////////////"
    "//////////////////////////////////////////////////wgALCAAKAAoBAREA/8QA"
    "FBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
)


def get_system_health():
    """Return simulated system health metrics."""
    global _mock_temp
    # Slight random temperature drift
    _mock_temp += random.uniform(-0.5, 0.5)
    _mock_temp = max(35.0, min(65.0, _mock_temp))

    return {
        "cpu_temp_c": round(_mock_temp, 1),
        "uptime_seconds": round(time.time() - _start_time, 1),
        "inference_ms": random.randint(800, 1200),
        "uart_connected": False,
        "wifi_connected": True,
    }


def get_camera_frame():
    """
    Return a placeholder camera frame description.
    On real hardware this returns actual JPEG bytes.
    In mock mode we return metadata for a placeholder.
    """
    return {
        "available": False,
        "message": "Mock mode - no camera connected",
        "last_capture_time": time.time(),
    }


def get_camera_jpeg_bytes() -> bytes:
    """Return raw JPEG bytes for the MJPEG stream or classification."""
    return base64.b64decode(_MOCK_JPEG_B64)
