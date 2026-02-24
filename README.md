# AI-Powered Smart Bin

![Status](https://img.shields.io/badge/Status-Prototyping-orange.svg)
![VCE](https://img.shields.io/badge/VCE-Systems_Engineering_3%264-blue.svg)
![Platform](https://img.shields.io/badge/Platform-MaixCAM_Pro-green.svg)
![Budget](https://img.shields.io/badge/Budget-~%24150_AUD-lightgrey.svg)

An AI-powered waste sorting system that eliminates recycling contamination at the point of disposal. Uses edge AI object detection to classify waste and a two-axis servo mechanism to sort items into the correct bin partition -- entirely offline.

Developed for VCE Systems Engineering Unit 3 & 4. Inspired by the [Ameru AI Bin](https://www.ameru.com.au/).

---

## How It Works

1. An item is placed on the central tray
2. The ultrasonic sensor triggers the camera
3. YOLO11s classifies the waste type on the NPU (~1 FPS, >90% accuracy)
4. Servo 1 rotates the tray to the correct partition (General / Recycling / Compost)
5. Servo 2 tilts the tray, dropping the item in
6. Servos return to home position

## Hardware

| Component | Role |
| :--- | :--- |
| Sipeed MaixCAM Pro | AI compute, camera, LCD display (RISC-V + 1 TOPS NPU) |
| 2x MG996R Servos | Pan & tilt actuation |
| HC-SR04 Ultrasonic Sensor | Item detection trigger |
| 5V 5A Power Supply | System power |

## Software

| Layer | Technology |
| :--- | :--- |
| OS | MaixCAM OS (Linux) |
| AI Model | YOLO11s @ 416x416, INT8 quantised `.cvimodel` |
| Language | Python + MaixPy |
| Vision | OpenCV |
| Training | Google Colab + Roboflow |

## Project Structure

```
ai-smart-bin-SE/
├── docs/               # VCE portfolio documentation
│   ├── 01_risk_assessment.md
│   ├── 02_testing_plan.md
│   ├── 03_budget.md
│   ├── 04_iteration_log.md
│   └── 05_future_scope.md
├── src/                # MaixCAM Python source code
├── models/             # Trained YOLO weights (.onnx, .cvimodel)
├── training/           # Colab notebooks and dataset config
├── cad/                # Mechanical design files
├── portfolio/          # Binary presentation files (.pptx)
└── PLAN.md             # Master project plan
```

## Documentation

See [`docs/README.md`](docs/README.md) for the full documentation index, or jump directly to:

- [Project Plan](PLAN.md) -- System architecture, mechanism design, AI strategy, and project timeline
- [Risk Assessment](docs/01_risk_assessment.md) -- Hardware and software risk analysis
- [Testing Plan](docs/02_testing_plan.md) -- Evaluation procedures and success criteria
- [Budget & BOM](docs/03_budget.md) -- Component list and cost breakdown (~$150 AUD)
- [Iteration Log](docs/04_iteration_log.md) -- YOLO11n vs YOLO11s engineering iteration
- [Future Scope](docs/05_future_scope.md) -- Cloud VLMs and open-source dataset alternatives
