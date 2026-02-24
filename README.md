# AI-Powered Smart Bin

![Status](https://img.shields.io/badge/Status-Prototyping-orange.svg)
![VCE](https://img.shields.io/badge/VCE-Systems_Engineering_3%264-blue.svg)
![Platform](https://img.shields.io/badge/Platform-MaixCAM_Pro_%2B_ESP32-green.svg)
![Budget](https://img.shields.io/badge/Budget-~%24155_AUD-lightgrey.svg)

An AI-powered waste sorting system that eliminates recycling contamination at the point of disposal. Uses edge AI object detection to classify waste and a two-axis servo mechanism to sort items into the correct bin partition -- entirely offline, with an optional cloud LLM mode and a web-based control dashboard.

Developed for VCE Systems Engineering Unit 3 & 4. Inspired by the [Ameru AI Bin](https://www.ameru.com.au/).

---

## How It Works

```
  [ Item placed on tray ]
           |
  ESP32: HC-SR04 detects item --> UART --> MaixCAM: "item detected"
           |
  MaixCAM: Capture image
           |
       ┌───┴───┐
   YOLO Mode   LLM Mode
   (offline)   (cloud)
       └───┬───┘
           |
  MaixCAM: UART --> ESP32: "sort recycling"
           |
  ESP32: Servo 1 pan --> Servo 2 tilt --> Home
           |
  MaixCAM: Log to SQLite --> Push to Web Dashboard
```

## Architecture

The system uses a **dual-board architecture**:

| Board | Role | Responsibilities |
| :--- | :--- | :--- |
| **MaixCAM Pro** | Brain | AI inference, camera, LCD UI, web server, decision-making |
| **ESP32** | Muscles | Servo PWM, ultrasonic sensor, real-time hardware control |

Connected over UART serial. See [`docs/06_serial_protocol.md`](docs/06_serial_protocol.md) for the protocol spec.

## Hardware

| Component | Role |
| :--- | :--- |
| Sipeed MaixCAM Pro | AI compute, camera, LCD display, Wi-Fi (RISC-V + 1 TOPS NPU) |
| ESP32 DevKit | Real-time servo/sensor control over UART |
| 2x MG996R Servos | Pan & tilt actuation |
| HC-SR04 Ultrasonic Sensor | Item detection trigger |
| 5V 5A Power Supply | System power |

## Software

| Layer | Technology |
| :--- | :--- |
| AI Model | YOLO11s @ 416x416, INT8 quantised `.cvimodel` (local) |
| Cloud AI | OpenRouter API -- Llama-4-Scout VLM (optional) |
| MaixCAM | Python + MaixPy + Flask/FastAPI |
| ESP32 | Arduino / MicroPython |
| Web Dashboard | HTML/CSS/JS + REST API + SSE |
| Data | SQLite (sorting history & statistics) |

## Web Dashboard

Accessible at `http://<maixcam-ip>:8080` on the local network:

- **Mode Switching** -- Toggle between local YOLO and cloud LLM classification
- **Live Stats** -- Items sorted, category breakdown, accuracy tracking
- **Camera Feed** -- Live or last-frame view with detection overlay
- **System Health** -- Temperature, uptime, inference latency
- **Manual Controls** -- Servo calibration, manual sort trigger, home reset

## Project Structure

```
ai-smart-bin-SE/
├── docs/                   # VCE portfolio documentation
│   ├── 01_risk_assessment.md
│   ├── 02_testing_plan.md
│   ├── 03_budget.md
│   ├── 04_iteration_log.md
│   ├── 05_future_scope.md
│   └── 06_serial_protocol.md
├── src/
│   ├── maixcam/            # MaixCAM Python: AI inference, control loop, serial comms
│   ├── esp32/              # ESP32 firmware: servo PWM, sensor, UART listener
│   └── web/                # Web dashboard: Flask backend + HTML/JS frontend
├── models/                 # Trained YOLO weights (.onnx, .cvimodel)
├── training/               # Colab notebooks and dataset config
├── cad/                    # Mechanical design files
├── portfolio/              # Binary presentation files (.pptx)
└── PLAN.md                 # Master project plan
```

## Documentation

See [`docs/README.md`](docs/README.md) for the full documentation index, or jump directly to:

- [Project Plan](PLAN.md) -- System architecture, mechanism design, AI strategy, and project timeline
- [Risk Assessment](docs/01_risk_assessment.md) -- Hardware, software, and comms risk analysis
- [Testing Plan](docs/02_testing_plan.md) -- Evaluation procedures and success criteria
- [Budget & BOM](docs/03_budget.md) -- Component list and cost breakdown (~$155 AUD)
- [Iteration Log](docs/04_iteration_log.md) -- YOLO11n vs YOLO11s engineering iteration
- [Future Scope](docs/05_future_scope.md) -- Future enhancement directions
- [Serial Protocol](docs/06_serial_protocol.md) -- UART command spec between MaixCAM and ESP32
