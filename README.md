# Smart Sort Bin

![Status](https://img.shields.io/badge/Status-Prototyping-orange.svg)
![VCE](https://img.shields.io/badge/VCE-Systems_Engineering_3%264-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Raspberry_Pi_3B-green.svg)

An AI-powered waste sorting system that eliminates recycling contamination at the point of disposal. A camera on a pan/tilt head captures each item, a cloud Vision Language Model classifies it, and servos direct it into the correct bin partition — all controlled from a web dashboard.

Developed for VCE Systems Engineering Unit 3 & 4. Inspired by the [Ameru AI Bin](https://www.ameru.com.au/).

---

## Architecture

The prototype runs entirely on a **Raspberry Pi 3B** (pivoted from the original ESP32-CAM dual-board design — see [`docs/04_iteration_log.md`](docs/04_iteration_log.md)):

```
  [ Item placed on tray ]
           |
  USB webcam captures frame (v4l2 mmap stream)
           |
  Cloud VLM classifies (OpenRouter / OpenAI / Gemini / Ollama)
           |
  Pan servo -> bin third, tilt servo -> dump, return home
           |
  Sort logged to SQLite, dashboard updates over SSE
```

| Component | Role |
| :--- | :--- |
| Raspberry Pi 3B | Runs Flask server, classification pipeline, servo control |
| USB webcam | Frame capture via `v4l2-ctl` mmap streaming |
| 2x MG996R servos | Pan (GPIO 17) and tilt (GPIO 27) via pigpio hardware PWM |
| WS2812B LED ring | Status colors (GPIO 18, not wired yet) |
| USB-C PD trigger board | External 5V rail for servos |

## Web Dashboard

One page at `http://<pi>:8080/`:

- **Camera** — live MJPEG stream, Snap & Sort pipeline with real-time stage progress, classify-only, snapshots, model comparison (two VLMs on the same frame, side by side)
- **Servo control** — XY drag pad, fine sliders, keyboard (WASD) and gamepad input. Inputs are throttled client-side and slew-rate-limited on the Pi so motion is always smooth
- **Animations** — server-side keyframe engine with built-in moves (wave, nod, scan, figure-8, …) plus a sequence editor to compose, preview, and save your own
- **Calibration** — set each bin's pan/tilt positions from the current head position, tune sequence timing, test a full dump without touching code
- **Stats** — totals, per-category breakdown, confidence/latency averages, 24-hour activity chart
- **Providers** — OpenRouter/OpenAI/Gemini/Ollama/custom, API keys and model IDs editable in the UI with connection tests

## Running Locally (no hardware)

Requires Python 3.11+ and [uv](https://docs.astral.sh/uv/):

```bash
cd src/web
uv run app.py --mock
```

Open http://127.0.0.1:8080 — everything works except the camera feed and physical servo motion.

## Running on the Pi

```bash
python deploy.py            # upload src/ + restart Flask on the Pi
python deploy.py --status   # check it's up
python deploy.py --logs     # tail Flask logs
python deploy.py --setup    # install systemd services (auto-start on boot)
```

The Pi runs `app.py --pi`, which loads the real hardware layer (`src/pi/hardware.py`). Requires the `pigpiod` daemon for jitter-free servo PWM.

See [`docs/pi_prototype_setup.md`](docs/pi_prototype_setup.md) for wiring, Pi configuration, and troubleshooting.

## Project Structure

```
smart-sort-bin/
├── deploy.py             # Push code to the Pi + restart
├── docs/                 # VCE portfolio documentation + Pi setup notes
├── src/
│   ├── pi/hardware.py    # Servos (pigpio + slew smoothing), camera, LED
│   ├── systemd/          # Service files for auto-start
│   └── web/
│       ├── app.py        # Flask API + dashboard
│       ├── animations.py # Server-side keyframe playback engine
│       ├── database.py   # SQLite: history, calibration, sequences, providers
│       ├── llm.py        # VLM provider abstraction + waste prompt
│       ├── templates/pi/ # Dashboard templates
│       └── static/       # app.css + JS modules
├── cad/                  # Mechanical design files
└── PLAN.md               # Original project plan
```

## Documentation

- [Project Plan](PLAN.md) — original architecture, mechanism design, AI strategy
- [Pi Setup](docs/pi_prototype_setup.md) — wiring, OS config, troubleshooting
- [Handoff](docs/handoff.md) — current state, how to deploy, next tasks
- [Risk Assessment](docs/01_risk_assessment.md) · [Testing Plan](docs/02_testing_plan.md) · [Budget](docs/03_budget.md) · [Iteration Log](docs/04_iteration_log.md) · [Future Scope](docs/05_future_scope.md)
