"""
AI Smart Bin - Servo Animation Engine

Server-side keyframe playback for pan/tilt animations. The old system drove
effects from the browser (~60 HTTP POSTs/sec, died when the tab closed);
this engine runs a playback thread on the Pi and writes servo positions
directly, so animations are smooth and survive the client disconnecting.

Keyframe format: {"pan": -1..1, "tilt": -1..1, "ms": duration, "ease": name}
Each keyframe means "move from wherever you are to (pan, tilt) over ms".
"""

import logging
import math
import random
import threading
import time

log = logging.getLogger(__name__)

TICK_HZ = 50

# ── Easing functions (t in 0..1) ──

EASINGS = {
    "linear": lambda t: t,
    "in": lambda t: t * t * t,
    "out": lambda t: 1 - (1 - t) ** 3,
    "inout": lambda t: 4 * t * t * t if t < 0.5 else 1 - ((-2 * t + 2) ** 3) / 2,
    # step-start: jump to target immediately, then hold for the duration
    "hold": lambda t: 1.0,
}


def kf(pan, tilt, ms, ease="inout"):
    return {"pan": pan, "tilt": tilt, "ms": ms, "ease": ease}


# ── Path generators for geometric patterns ──


def _parametric(fn, cycles=1.0, steps=60, ms_per_step=40):
    """Build keyframes from a parametric function t(0..1) -> (pan, tilt)."""
    frames = []
    for i in range(1, steps + 1):
        t = (i / steps) * cycles
        pan, tilt = fn(t)
        frames.append(kf(round(pan, 3), round(tilt, 3), ms_per_step, "linear"))
    frames.append(kf(0, 0, 400))
    return frames


def _circle():
    return _parametric(
        lambda t: (math.cos(t * 2 * math.pi) * 0.35, math.sin(t * 2 * math.pi) * 0.35),
        cycles=2, steps=100, ms_per_step=45,
    )


def _figure8():
    return _parametric(
        lambda t: (math.sin(t * 2 * math.pi) * 0.4, math.sin(t * 4 * math.pi) * 0.3),
        cycles=2, steps=120, ms_per_step=40,
    )


def _spiral():
    def fn(t):
        angle = t * math.pi * 8
        r = t * 2 * 0.5 if t < 0.5 else (1 - t) * 2 * 0.5
        return (math.cos(angle) * r, math.sin(angle) * r)
    return _parametric(fn, cycles=1, steps=140, ms_per_step=40)


def _heart():
    def fn(t):
        a = t * 2 * math.pi
        x = 16 * math.sin(a) ** 3
        y = 13 * math.cos(a) - 5 * math.cos(2 * a) - 2 * math.cos(3 * a) - math.cos(4 * a)
        return ((x / 16) * 0.35, -(y / 16) * 0.35)
    return _parametric(fn, cycles=1, steps=100, ms_per_step=45)


def _idle_wander():
    """One random glance; regenerated each loop cycle."""
    pan = round((random.random() - 0.5) * 1.4, 3)
    tilt = round((random.random() - 0.3) * 0.8, 3)
    move_ms = int(800 + random.random() * 1200)
    pause_ms = int(500 + random.random() * 2000)
    return [
        kf(pan, tilt, move_ms),
        kf(pan, tilt, pause_ms, "hold"),
    ]


# ── Built-in animations ──
# "keyframes" is a list, or a callable returning a list (regenerated each
# loop cycle — used for randomised animations).

BUILTINS = {
    "wave": {
        "label": "Wave Hello", "icon": "wave", "loop": False,
        "keyframes": (
            [kf(0.3 if i % 2 == 0 else -0.3, -0.2, 170, "out") for i in range(6)]
            + [kf(0, 0, 300)]
        ),
    },
    "nod": {
        "label": "Nod Yes", "icon": "nod", "loop": False,
        "keyframes": (
            sum([[kf(0, 0.3, 200, "out"), kf(0, -0.2, 200, "out")] for _ in range(4)], [])
            + [kf(0, 0, 300)]
        ),
    },
    "shake": {
        "label": "Shake No", "icon": "shake", "loop": False,
        "keyframes": (
            [kf(0.4 if i % 2 == 0 else -0.4, 0, 150, "out") for i in range(5)]
            + [kf(0, 0, 300)]
        ),
    },
    "look_around": {
        "label": "Look Around", "icon": "scan", "loop": False,
        "keyframes": [
            kf(-0.8, 0.1, 1000), kf(-0.8, 0.1, 700, "hold"),
            kf(0, -0.2, 1000), kf(0, -0.2, 600, "hold"),
            kf(0.8, 0.1, 1000), kf(0.8, 0.1, 700, "hold"),
            kf(0.3, -0.3, 800), kf(-0.5, 0.2, 900),
            kf(0, 0, 800),
        ],
    },
    "head_tilt": {
        "label": "Curious Tilt", "icon": "curious", "loop": False,
        "keyframes": [
            kf(0.4, 0.3, 600), kf(0.4, 0.3, 1200, "hold"),
            kf(-0.3, 0.25, 500), kf(-0.3, 0.25, 1000, "hold"),
            kf(0.1, 0.1, 400), kf(0, 0, 500),
        ],
    },
    "double_take": {
        "label": "Double Take", "icon": "surprise", "loop": False,
        "keyframes": [
            kf(-0.6, 0.1, 200, "out"), kf(-0.6, 0.1, 400, "hold"),
            kf(0.3, -0.1, 150, "out"), kf(0.3, -0.1, 200, "hold"),
            kf(-0.1, 0.15, 250, "out"), kf(-0.1, 0.15, 600, "hold"),
            kf(0, 0, 400),
        ],
    },
    "excited": {
        "label": "Excited Bounce", "icon": "bounce", "loop": False,
        "keyframes": (
            sum([[kf(0, -0.4, 140, "out"), kf(0, 0.2, 140, "out")] for _ in range(6)], [])
            + [kf(0, 0, 300)]
        ),
    },
    "peekaboo": {
        "label": "Peek-a-boo", "icon": "peek", "loop": False,
        "keyframes": (
            sum([[kf(0, 0.5, 500), kf(0, 0.5, 800, "hold"), kf(0, -0.2, 400)] for _ in range(3)], [])
            + [kf(0, 0, 300)]
        ),
    },
    "sleepy": {
        "label": "Sleepy", "icon": "sleep", "loop": False,
        "keyframes": [
            kf(0, 0.4, 800), kf(0.05, 0.55, 1200),
            kf(0.05, 0.55, 1500, "hold"), kf(0, 0, 1500),
        ],
    },
    "scan": {
        "label": "Robot Scan", "icon": "robot", "loop": False,
        "keyframes": (
            sum([
                [kf(p, -0.1 if abs(p) > 0.4 else 0.1, 300, "out"),
                 kf(p, -0.1 if abs(p) > 0.4 else 0.1, 300, "hold")]
                for p in [-0.6, -0.2, 0.2, 0.6, 0.2, -0.2] * 2
            ], [])
            + [kf(0, 0, 300)]
        ),
    },
    "dance": {
        "label": "Dance", "icon": "dance", "loop": False,
        "keyframes": (
            sum([[kf(p, t, 350, "out"), kf(p, t, 150, "hold")] for p, t in [
                (-0.5, 0.3), (0, -0.3), (0.5, 0.3), (0, -0.3),
                (-0.3, 0.5), (0.3, -0.1), (-0.5, -0.2), (0.5, 0.1),
            ] * 3], [])
            + [kf(0, 0, 400)]
        ),
    },
    "circle": {"label": "Circle", "icon": "circle", "loop": False, "keyframes": _circle()},
    "figure8": {"label": "Figure-8", "icon": "infinity", "loop": False, "keyframes": _figure8()},
    "spiral": {"label": "Spiral", "icon": "spiral", "loop": False, "keyframes": _spiral()},
    "heart": {"label": "Heart", "icon": "heart", "loop": False, "keyframes": _heart()},
    "idle_wander": {"label": "Idle Wander", "icon": "wander", "loop": True, "keyframes": _idle_wander},
}


class Player:
    """Plays keyframe sequences on the servo hardware in a background thread."""

    def __init__(self, hw, broadcast=None):
        self.hw = hw
        self.broadcast = broadcast or (lambda *a, **k: None)
        self._thread = None
        self._stop_flag = threading.Event()
        self._lock = threading.Lock()
        self._current = None  # {"name", "label", "loop"}

    # ── Public API ──

    def list_animations(self):
        return [
            {"name": name, "label": b["label"], "icon": b.get("icon", ""), "loop": b["loop"]}
            for name, b in BUILTINS.items()
        ]

    def status(self):
        with self._lock:
            if not self._current:
                return {"playing": False}
            return {"playing": True, **self._current}

    def play_builtin(self, name):
        builtin = BUILTINS.get(name)
        if not builtin:
            raise ValueError(f"Unknown animation: {name}")
        self._start(
            meta={"name": name, "label": builtin["label"], "loop": builtin["loop"]},
            keyframes=builtin["keyframes"],
            loop=builtin["loop"],
        )

    def play_keyframes(self, keyframes, loop=False, name="custom", label="Custom"):
        if not keyframes:
            raise ValueError("No keyframes provided")
        self._start(
            meta={"name": name, "label": label, "loop": bool(loop)},
            keyframes=keyframes,
            loop=bool(loop),
        )

    def stop(self, and_home=True):
        """Stop playback. Returns True if something was playing."""
        was_playing = False
        with self._lock:
            was_playing = self._current is not None
        self._stop_flag.set()
        thread = self._thread
        if thread and thread.is_alive():
            thread.join(timeout=2)
        with self._lock:
            self._current = None
        if was_playing:
            if and_home:
                self.hw.set_pan(0)
                self.hw.set_tilt(0)
            self.broadcast("animation_state", {"playing": False})
        return was_playing

    # ── Internals ──

    def _start(self, meta, keyframes, loop):
        self.stop(and_home=False)
        self._stop_flag.clear()
        with self._lock:
            self._current = meta
        self._thread = threading.Thread(
            target=self._run, args=(keyframes, loop, meta), daemon=True
        )
        self._thread.start()
        self.broadcast("animation_state", {"playing": True, **meta})

    def _resolve(self, keyframes):
        frames = keyframes() if callable(keyframes) else keyframes
        return list(frames)

    def _run(self, keyframes, loop, meta):
        tick = 1.0 / TICK_HZ
        last_broadcast = 0.0
        try:
            while not self._stop_flag.is_set():
                frames = self._resolve(keyframes)
                for frame in frames:
                    if self._stop_flag.is_set():
                        return
                    start_pos = self.hw.get_position()
                    start_pan = start_pos["pan"]
                    start_tilt = start_pos["tilt"]
                    target_pan = max(-1.0, min(1.0, float(frame.get("pan", 0))))
                    target_tilt = max(-1.0, min(1.0, float(frame.get("tilt", 0))))
                    duration = max(0.02, float(frame.get("ms", 500)) / 1000.0)
                    ease = EASINGS.get(frame.get("ease", "inout"), EASINGS["inout"])

                    t0 = time.time()
                    while True:
                        if self._stop_flag.is_set():
                            return
                        elapsed = time.time() - t0
                        t = min(1.0, elapsed / duration)
                        e = ease(t)
                        pan = start_pan + (target_pan - start_pan) * e
                        tilt = start_tilt + (target_tilt - start_tilt) * e
                        self.hw.set_pan(pan, immediate=True)
                        self.hw.set_tilt(tilt, immediate=True)

                        now = time.time()
                        if now - last_broadcast > 0.15:
                            last_broadcast = now
                            self.broadcast("servo_update", {
                                "axis": "both",
                                "pan": round(pan, 3),
                                "tilt": round(tilt, 3),
                                "source": "animation",
                            })
                        if t >= 1.0:
                            break
                        time.sleep(tick)
                if not loop:
                    break
        except Exception as e:
            log.error(f"Animation error ({meta.get('name')}): {e}")
        finally:
            with self._lock:
                self._current = None
            self._stop_flag.set()
            self.broadcast("animation_state", {"playing": False, "finished": meta.get("name")})
            self.broadcast("servo_update", {
                "axis": "both", "pan": 0, "tilt": 0, "source": "animation",
            })
            # Return home smoothly after one-shot animations
            if not loop:
                self.hw.set_pan(0)
                self.hw.set_tilt(0)


# ── Module-level singleton ──

_player = None


def init(hw, broadcast):
    global _player
    _player = Player(hw, broadcast)
    log.info(f"Animation engine ready ({len(BUILTINS)} built-ins)")
    return _player


def get_player():
    return _player
