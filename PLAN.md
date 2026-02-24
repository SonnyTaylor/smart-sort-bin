# Project Plan: AI-Powered Smart Bin (Systems Engineering 3&4)

## 1. Project Overview

- **Objective:** Develop a low-cost, AI-powered smart bin capable of automatically sorting waste into three distinct categories using a custom-trained YOLO11 object detection model, with an optional cloud LLM fallback and a web-based control dashboard.
- **Inspiration:** Ameru AI Bin.
- **Core Mechanism:** A rotating and tilting tray system driven by two servos to direct waste into one of the three internal partitions.
- **Constraint:** Self-funded, requiring a strict focus on low-cost, high-value components.

## 2. System Architecture

The system uses a **dual-board architecture** to separate concerns:

| Board | Role | Responsibilities |
| :--- | :--- | :--- |
| **MaixCAM Pro** | Brain | AI inference (YOLO / LLM), camera, LCD UI, web server, decision-making |
| **ESP32** | Muscles | Servo PWM, ultrasonic sensor, real-time hardware control |

The two boards communicate over **UART serial** using a simple command protocol. This separation ensures that real-time servo timing is never disrupted by AI inference load, and the MaixCAM can be rebooted or updated without leaving servos in an unsafe state.

> Protocol specification: [`docs/06_serial_protocol.md`](docs/06_serial_protocol.md)

### Hardware Components (Low-Cost Focus)

- **AI Compute:** Sipeed MaixCAM Pro (~$86.99 AUD) -- Built-in NPU for YOLO object detection, integrated camera, touchscreen LCD, and Wi-Fi for the web dashboard. Replaces the need for a separate Raspberry Pi, camera, and screen.
- **Hardware Controller:** ESP32 DevKit (~$4.50 AUD) -- Dedicated microcontroller for real-time servo PWM and sensor reading. Hardware timers ensure microsecond-accurate pulse generation independent of AI workload.
- **Camera:** Integrated MaixCAM Pro Camera.
- **Actuators:** 2x High-Torque Standard Servos (e.g., MG996R). Cheap but provide enough torque to handle the tray and the weight of typical waste items.
- **Sensors:** 1x Ultrasonic sensor (HC-SR04) to detect when an item is placed on the tray, triggering the camera and AI.
- **Power:**
  - 5V Power supply for the MaixCAM Pro and ESP32 (shared, logic rail).
  - A separate buck converter or power supply for the servos to prevent voltage drops and brownouts when the servos draw stall current.
- **Structure:** Repurposed standard bin with internal partitions made from cheap materials (corrugated plastic, thin MDF, or 3D printed parts).

> Full bill of materials and budget breakdown: [`docs/03_budget.md`](docs/03_budget.md)

### Software Stack

- **MaixCAM Pro (Linux / MaixCAM OS):**
  - **AI Inference:** MaixPy + YOLO11s (local) or OpenRouter API (cloud LLM mode).
  - **Computer Vision:** OpenCV for image preprocessing.
  - **Web Server:** Flask/FastAPI serving the control dashboard over Wi-Fi.
  - **Serial Comms:** Python `serial` library for UART commands to the ESP32.
  - **LCD UI:** MaixPy display libraries for the on-device screen.

- **ESP32 (Arduino / MicroPython):**
  - **Servo Control:** Hardware PWM for precise pan/tilt actuation.
  - **Sensor Reading:** HC-SR04 ultrasonic with hardware timer interrupts and software debounce.
  - **Serial Comms:** UART listener for commands from MaixCAM, acknowledgement responses.
  - **Failsafe:** Watchdog timer returns servos to home position if no heartbeat from MaixCAM within 5 seconds.

## 3. Mechanism Design: Rotate & Tilt

The sorting mechanism operates on a two-axis system:

1. **The Tray:** The central landing zone for waste.
2. **Servo 1 (Pan/Rotate):** Mounted vertically. It rotates the entire tray assembly to align the dropping edge with one of the three partitions (e.g., General, Recycling, Compost).
3. **Servo 2 (Tilt):** Mounted horizontally on the rotating assembly. It tilts the tray downwards to let gravity slide the item into the selected partition.

### Structural Design: Top Frame Method

To handle the bin bags cleanly without them interfering with the central servos:

- **Base Bin:** A single large 60L-75L rectangular container.
- **Top Plate:** A laser-cut piece of acrylic or 4mm wood mounted across the top of the bin.
- **Drop Zones:** The top plate features three distinct cutouts/holes corresponding to General, Recycling, and Compost.
- **Bag Management:** Individual bin bags are pushed through each hole, folded back over the lip of the wood/acrylic, and secured tightly using bulldog/binder clips.
- **Mechanism Mounting:** The servo pan/tilt tray is mounted securely to the centre of this top plate.
- **Emptying:** The entire top plate lifts off, providing clear access to tie and remove the bags.

## 4. AI & Classification Modes

The system supports two classification modes, switchable from the web dashboard:

### Mode 1: Local YOLO (Default)
- YOLO11s (Small) at 416x416 resolution, INT8 quantised, running on the MaixCAM Pro's 1 TOPS NPU.
- ~1 FPS inference. >90% accuracy on the custom dataset.
- Fully offline. No network dependency.

### Mode 2: Cloud LLM
- Captures an image and sends it to a Vision Language Model (e.g., `meta-llama/llama-4-scout` via OpenRouter API).
- Returns granular item identification (e.g., "Snickers bar wrapper" rather than just "General Waste").
- Requires Wi-Fi connectivity. Falls back to local YOLO automatically if the network is unavailable.

### Model Training Pipeline
1. **Data Collection:** Gather a diverse dataset of common waste items. *Crucially, take these photos on the actual tray under the lighting conditions the bin will experience.* This reduces domain shift.
2. **Annotation:** Use a free tool like Roboflow to label the dataset into the 3 target classes.
3. **Training:** Train a YOLO11s (Small) model at 416x416 resolution using Google Colab. We avoid YOLO26 due to NPU toolchain operator incompatibility, and we choose the 's' variant over 'n' to ensure better feature extraction for visually similar waste items.
4. **Optimisation:** Export the model to ONNX (`opset=11`) and use Sipeed's MaixHub or Docker toolkit to convert it to an INT8 `.cvimodel` (or `.mud`) format.

> Iteration history and model comparison: [`docs/04_iteration_log.md`](docs/04_iteration_log.md)

## 5. Web Dashboard

The MaixCAM Pro hosts a lightweight web server accessible from any device on the same network. The dashboard provides:

| Feature | Description |
| :--- | :--- |
| **Mode Switching** | Toggle between local YOLO and cloud LLM classification |
| **Live Stats** | Items sorted, category breakdown (pie/bar chart), accuracy tracking over time |
| **Camera Feed** | Live or last-frame view with YOLO detection overlay and confidence scores |
| **System Health** | CPU/NPU temperature, uptime, inference latency, power draw estimate |
| **Manual Controls** | Servo calibration sliders, manual sort trigger, home position reset |

### Technical Implementation
- **Backend:** Flask or FastAPI running on the MaixCAM Pro, serving a REST API.
- **Frontend:** Alpine.js for reactivity + Tailwind CSS for styling (both loaded via CDN -- zero build step). Uses Server-Sent Events (SSE) for real-time stats updates.
- **Data Persistence:** SQLite database on the MaixCAM Pro's storage for sorting history and statistics.
- **Access:** Available at `http://<maixcam-ip>:8080` on the local network. No authentication required for MVP (local network only).

## 6. Project Phases & Timeline

### Phase 1: Research & Procurement
- Finalise hardware selection based on current market prices.
- Order all electronic components (including ESP32).
- Source the base bin and structural materials.

### Phase 2: Mechanical Prototyping
- Design the 3-partition layout for the inside of the bin.
- Build a prototype of the rotate/tilt mechanism (cardboard or 3D printed).
- Test servo torque to ensure they can lift the tray with a heavy item (like a full water bottle).

### Phase 3: ESP32 Firmware
- Implement the UART serial protocol listener on the ESP32.
- Write servo PWM control with configurable angles per waste category.
- Implement HC-SR04 sensor reading with debounce and interrupt-driven triggering.
- Add watchdog failsafe (home servos if MaixCAM heartbeat lost).

### Phase 4: AI Development
- Set up the camera and gather the initial image dataset.
- Annotate the dataset and train the first version of the YOLO model.
- Test the model's accuracy and inference speed on the MaixCAM Pro.
- Implement cloud LLM mode with OpenRouter API integration and automatic fallback.

### Phase 5: Web Dashboard
- Build the Flask/FastAPI backend with REST API endpoints.
- Create the frontend dashboard (stats, camera feed, controls).
- Set up SQLite for sorting history persistence.
- Implement mode switching and servo calibration controls.

### Phase 6: System Integration
- Connect MaixCAM to ESP32 over UART.
- Develop the main Python control loop on the MaixCAM:
  1. Receive item detection event from ESP32 (sensor interrupt).
  2. Capture an image.
  3. Run classification (YOLO or LLM depending on active mode).
  4. Send sort command to ESP32 with target partition angle.
  5. ESP32 executes pan -> tilt -> home sequence.
  6. Log result to SQLite and broadcast to web dashboard.
- Assemble the electronics permanently.

### Phase 7: Testing & Refinement
- Conduct end-to-end testing with real waste.
- Verify UART reliability under sustained operation.
- Test web dashboard responsiveness and real-time updates.
- Identify edge cases (e.g., items getting stuck, misclassifications) and refine the mechanical design or retrain the model with the failure cases.

> Evaluated alternatives and future directions: [`docs/05_future_scope.md`](docs/05_future_scope.md)
