"""
AI Smart Bin - Mock Hardware Layer

Simulates sensor events, classifications, and system health
so the dashboard can be developed and tested without hardware.
"""

import random
import time
import threading

import config
import database


# Simulated system health
_start_time = time.time()
_mock_temp = 42.0


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
        "uart_connected": True,
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


def simulate_sort():
    """
    Simulate a single sort event with random data.
    Returns the generated sort event dict.
    """
    mode = database.get_mode()
    category = random.choice(config.CATEGORIES)
    confidence = round(random.uniform(0.70, 0.99), 2)
    duration_ms = random.randint(1200, 2800)

    # In LLM mode, generate a specific item label
    labels = {
        "general": [
            "Snickers wrapper",
            "Chip packet",
            "Tissue",
            "Plastic straw",
            "Styrofoam cup",
            "Cigarette butt",
        ],
        "recycling": [
            "Plastic bottle",
            "Aluminium can",
            "Cardboard box",
            "Glass jar",
            "Newspaper",
            "Milk carton",
        ],
        "compost": [
            "Apple core",
            "Banana peel",
            "Tea bag",
            "Egg shell",
            "Orange peel",
            "Coffee grounds",
        ],
    }
    label = random.choice(labels[category]) if mode == config.MODE_LLM else ""

    database.log_sort(category, confidence, mode, label, duration_ms)

    return {
        "category": category,
        "confidence": confidence,
        "mode": mode,
        "label": label,
        "duration_ms": duration_ms,
    }


class MockSensorLoop:
    """
    Background thread that simulates periodic item detections.
    Calls a callback function whenever a 'sort' happens.
    """

    def __init__(self, on_sort_callback=None, interval_range=(4, 10)):
        self.on_sort = on_sort_callback
        self.interval_range = interval_range
        self._running = False
        self._thread = None

    def start(self):
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False

    def _loop(self):
        while self._running:
            wait = random.uniform(*self.interval_range)
            time.sleep(wait)
            if not self._running:
                break
            event = simulate_sort()
            if self.on_sort:
                self.on_sort(event)
