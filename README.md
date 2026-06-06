# Smart Sort Bin

![Status](https://img.shields.io/badge/Status-Prototyping-orange.svg)
![VCE](https://img.shields.io/badge/VCE-Systems_Engineering_3%264-blue.svg)
![Platform](https://img.shields.io/badge/Platform-ESP32--CAM_%2B_ESP32-green.svg)
![Budget](https://img.shields.io/badge/Budget-~%24111_AUD-lightgrey.svg)

An AI-powered waste sorting system that eliminates recycling contamination at the point of disposal. Uses a cloud Vision Language Model to classify waste and a two-axis servo mechanism to sort items into the correct bin partition, with a web-based control dashboard.

Developed for VCE Systems Engineering Unit 3 & 4. Inspired by the [Ameru AI Bin](https://www.ameru.com.au/).

---

## Running the Web Dashboard (PC)

The web dashboard lets you test and monitor the AI classification system from your computer — no hardware required.

### Step 1 — Install Python

1. Go to **https://www.python.org/downloads/**
2. Click the big yellow **"Download Python"** button
3. Run the installer
4. **Important:** On the first screen, tick the box that says **"Add Python to PATH"** before clicking Install

To check it worked, open **Command Prompt** (press `Win + R`, type `cmd`, press Enter) and type:
```
python --version
```
You should see something like `Python 3.11.x` or higher.

---

### Step 2 — Install uv

`uv` is a fast tool that manages Python packages. Open **Command Prompt** and paste this:

```
pip install uv
```

To check it worked:
```
uv --version
```

---

### Step 3 — Download this project

If you have Git installed:
```
git clone https://github.com/SonnyTaylor/smart-sort-bin.git
cd smart-sort-bin
```

Or click the green **"Code"** button on this page → **"Download ZIP"**, then extract the folder somewhere on your computer.

---

### Step 4 — Run the dashboard

Open **Command Prompt**, navigate into the project's web folder:

```
cd path\to\smart-sort-bin\src\web
```

Then run:

```
uv run app.py
```

`uv` will automatically install all required packages the first time, then start the server.

You should see output like:
```
 * Running on http://127.0.0.1:8080
```

Open that link in your browser — the dashboard will load.

---

### Stopping the server

Press `Ctrl + C` in the Command Prompt window.

---

## How It Works

```
  [ Item placed on tray ]
           |
  ESP32: HC-SR04 detects item --> UART --> ESP32-CAM: "item detected"
           |
  ESP32-CAM: Capture image --> WiFi --> Cloud VLM classifies
           |
  ESP32-CAM: UART --> ESP32: "sort recycling"
           |
  ESP32: Servo 1 pan --> Servo 2 tilt --> Home
           |
  ESP32-CAM: Log to SQLite --> Push to Web Dashboard
```

## Architecture

The system uses a **dual-board architecture**:

| Board | Role | Responsibilities |
| :--- | :--- | :--- |
| **ESP32-CAM** | Brain | Camera capture, WiFi, cloud VLM classification, web server |
| **ESP32 DevKit** | Muscles | Servo PWM, ultrasonic sensor, real-time hardware control |

Connected over UART serial. See [`docs/06_serial_protocol.md`](docs/06_serial_protocol.md) for the protocol spec.

## Hardware

| Component | Role |
| :--- | :--- |
| ESP32-CAM (OV2640) | Camera capture, WiFi, cloud VLM classification |
| ESP32 DevKit | Real-time servo/sensor control over UART |
| 2x MG996R Servos | Pan & tilt actuation |
| HC-SR04 Ultrasonic Sensor | Item detection trigger |
| USB-C PD Trigger Board | 5V power from any USB-C PD charger |
| WS2812B LED Ring (12 LED) | Camera illumination + category feedback |

## Software

| Layer | Technology |
| :--- | :--- |
| AI Classification | Cloud VLM (GPT-4o, Gemini, Llama Vision via OpenRouter) |
| ESP32-CAM | Arduino + WiFi HTTP client |
| ESP32 | Arduino (servo PWM, UART, sensor) |
| Web Dashboard | Alpine.js + Tailwind CSS (CDN) + REST API + SSE |
| Data | SQLite (sorting history & statistics) |

## Web Dashboard Features

Accessible at `http://localhost:8080` when running locally, or `http://<esp32-cam-ip>:8080` on the physical device:

- **Live Stats** — Items sorted, category breakdown, accuracy tracking
- **Camera Feed** — Live or last-frame view with classification results
- **System Health** — Uptime, inference latency, connectivity
- **Manual Controls** — Servo calibration, manual sort trigger, home reset
- **LLM Settings** — Provider selection (OpenRouter/OpenAI/Gemini/Ollama/Custom), model ID input
- **Model Comparison** — Run two VLM providers side-by-side on the same image
- **Dataset Collection** — Save images for accuracy auditing, export as ZIP

## Project Structure

```
smart-sort-bin/
├── docs/                   # VCE portfolio documentation
│   ├── 01_risk_assessment.md
│   ├── 02_testing_plan.md
│   ├── 03_budget.md
│   ├── 04_iteration_log.md
│   ├── 05_future_scope.md
│   └── 06_serial_protocol.md
├── src/
│   ├── esp32/              # ESP32 firmware: servo PWM, sensor, UART listener
│   └── web/                # Web dashboard: Flask backend + HTML/JS frontend
├── cad/                    # Mechanical design files
├── portfolio/              # Presentation files
└── PLAN.md                 # Master project plan
```

## Documentation

- [Project Plan](PLAN.md) — System architecture, mechanism design, AI strategy, and timeline
- [Risk Assessment](docs/01_risk_assessment.md) — Hardware, software, and comms risk analysis
- [Testing Plan](docs/02_testing_plan.md) — Evaluation procedures and success criteria
- [Budget & BOM](docs/03_budget.md) — Component list and cost breakdown (~$111 AUD)
- [Iteration Log](docs/04_iteration_log.md) — YOLO vs cloud VLM engineering iteration
- [Future Scope](docs/05_future_scope.md) — Future enhancement directions
- [Serial Protocol](docs/06_serial_protocol.md) — UART command spec between ESP32-CAM and ESP32
