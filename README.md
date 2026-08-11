# Smart Sort Bin

![Status](https://img.shields.io/badge/Status-Prototyping-orange.svg)
![VCE](https://img.shields.io/badge/VCE-Systems_Engineering_3%264-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Raspberry_Pi_3B-green.svg)

An AI-powered waste sorting system that eliminates recycling contamination at the point of disposal. A camera on a pan/tilt head captures each item, a cloud Vision Language Model classifies it, and servos tip it into one of three bags hanging in the bin, all controlled from a web dashboard.

The head sits on a printed tripod that clamps across the bin rim on three PVC legs. Moving the whole thing to a different bin means cutting three new legs and nothing else.

**Build status:** electronics and software run. None of the nine printed parts have been made yet. See the [build log](docs/build_log.md).

Developed for VCE Systems Engineering Unit 3 & 4. Inspired by the [Ameru AI Bin](https://www.ameru.com.au/).

---

## Architecture

The prototype runs entirely on a **Raspberry Pi 3B**, pivoted from the original two-board ESP32-CAM design. That iteration is written up in the PowerPoint.

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

- **Camera**: live MJPEG stream, Snap & Sort pipeline with real-time stage progress, classify-only, snapshots, model comparison (two VLMs on the same frame, side by side)
- **Servo control**: XY drag pad, fine sliders, keyboard (WASD) and gamepad input. Inputs are throttled client-side and slew-rate-limited on the Pi so motion is always smooth
- **Animations**: server-side keyframe engine with built-in moves (wave, nod, scan, figure-8, ...) plus a sequence editor to compose, preview, and save your own
- **Calibration**: set each bin's pan/tilt positions from the current head position, tune sequence timing, test a full dump without touching code
- **Stats**: totals, per-category breakdown, confidence/latency averages, 24-hour activity chart
- **Providers**: OpenRouter/OpenAI/Gemini/Ollama/custom, API keys and model IDs editable in the UI with connection tests

## Running Locally (no hardware)

Requires Python 3.11+ and [uv](https://docs.astral.sh/uv/):

```bash
cd src/web
uv run app.py --mock
```

Open http://127.0.0.1:8080. Everything works except the camera feed and physical servo motion.

## Running on the Pi

Run `python tools/deploy.py` to push the code and restart Flask.

The Pi runs `app.py --pi`, which loads the real hardware layer (`src/pi/hardware.py`) and needs the `pigpiod` daemon for jitter-free servo PWM.

The other flags, the wiring, the OS setup and the troubleshooting are all in [`docs/pi_setup.md`](docs/pi_setup.md), which is the one place the deploy commands are written out in full.

## Project Structure

```
smart-sort-bin/
├── portfolio/            # The VCE PowerPoint. ai_bin.js generates it
├── src/                  # The code that runs the bin
│   ├── pi/hardware.py    # Servos (pigpio + slew smoothing), camera, LED
│   ├── systemd/          # Service files for auto-start
│   ├── esp32/            # Dead firmware from the old two-board design
│   └── web/              # Flask app, dashboard, database, VLM providers
├── cad/                  # Fusion exports, plus the design-evolution renders
├── docs/                 # Build log, mechanical design, Pi setup notes
├── tools/                # deploy.py, check_docs.py
└── PLAN.md               # Original project plan, frozen
```

## Documentation

The VCE portfolio is a PowerPoint, generated from
[`portfolio/ai_bin.js`](portfolio/ai_bin.js) by running `bun run ai_bin.js`. It
is the up-to-date record of the risk assessment, budget, testing, iteration
history and evaluation, and it has been submitted once already.

Everything else has one home, and this is the list of homes:

- [Build log](docs/build_log.md): what has actually been built, dated. **Start here**
- [Mechanical Design](docs/mechanical_design.md): how the sorting mechanism works, with verified clearances
- [Mechanical Iteration Log](docs/mechanical_iteration_log.md): fourteen faults found and corrected before printing
- [CAD](cad/README.md): parts, hardware list and assembly order
- [Design evolution renders](cad/renders/README.md): how the old versions of each part get drawn from git history
- [Pi Setup](docs/pi_setup.md): wiring, OS config, deploy commands, troubleshooting
- [Pi TODO](docs/pi_todo.md): what is left to do
- [Project Plan](PLAN.md): the original plan, frozen as a historical record

If you are an AI agent working in this repo, read [AGENTS.md](AGENTS.md) first.
It has the rules that stop these documents drifting apart, and
`python tools/check_docs.py` enforces them.

