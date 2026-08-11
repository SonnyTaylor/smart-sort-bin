# Project Plan: AI-Powered Smart Bin (Systems Engineering 3&4)

## 1. Project Overview

- **Objective:** Develop a low-cost, AI-powered smart bin capable of automatically sorting waste into three distinct categories using a cloud Vision Language Model, with a web-based control dashboard.
- **Inspiration:** Ameru AI Bin.
- **Core Mechanism:** A rotating and tilting tray system driven by two servos to direct waste into one of the three internal partitions.
- **Constraint:** Self-funded, requiring a strict focus on low-cost, high-value components.

## 2. System Architecture

The system uses a **dual-board architecture** to separate concerns:

| Board | Role | Responsibilities |
| :--- | :--- | :--- |
| **ESP32-CAM** | Brain | Camera capture, WiFi, cloud VLM classification, web server, decision-making |
| **ESP32 DevKit** | Muscles | Servo PWM, ultrasonic sensor, real-time hardware control |

The two boards communicate over **UART serial** using a simple command protocol. This separation ensures that real-time servo timing is never disrupted by WiFi/HTTP activity on the ESP32-CAM, and the ESP32-CAM can be rebooted or updated without leaving servos in an unsafe state.

> The two-board serial protocol was dropped when the build moved to a single Raspberry Pi.

### Hardware Components (Low-Cost Focus)

- **AI Compute:** ESP32-CAM (~$12 AUD) -- Built-in 2MP OV2640 camera and WiFi. Captures images and sends them to a cloud VLM for classification. No local AI inference required.
- **Hardware Controller:** ESP32 DevKit (~$8.67 AUD) -- Dedicated microcontroller for real-time servo PWM and sensor reading. Hardware timers ensure microsecond-accurate pulse generation independent of WiFi/HTTP workload.
- **Camera:** Integrated ESP32-CAM OV2640 (2MP).
- **Actuators:** 2x MG996R High-Torque Servos (180-degree, metal gear). Provide enough torque to handle the tray and the weight of typical waste items.
- **Sensors:** 1x HC-SR04 Ultrasonic sensor to detect when an item is placed on the tray, triggering the camera and classification.
- **Lighting:** WS2812B 12-LED ring (48mm, 5V) for consistent camera illumination and visual category feedback (green = compost, blue = recycling, red = general).
- **Power:** USB-C PD trigger board (~$3.14 AUD) negotiating 5V from any USB-C PD charger. 1000uF capacitors on the servo power rail to absorb stall current spikes.
- **Structure:** Repurposed standard 60L bin with a laser-cut MDF/acrylic top plate. 3D printed pan/tilt bracket (MakerWorld model 973248, adapted for MG996R).

> Current bill of materials and budget: the Parts List & Budget slide in `portfolio/ai_bin.js`.

### Software Stack

- **ESP32-CAM (Arduino):**
  - **Camera:** ESP32 camera library for JPEG capture.
  - **WiFi/HTTP:** Sends captured image to cloud VLM API, receives JSON classification.
  - **Web Server:** Hosts the control dashboard over WiFi.
  - **Serial Comms:** UART commands to the ESP32 DevKit.

- **ESP32 DevKit (Arduino):**
  - **Servo Control:** Hardware PWM for precise pan/tilt actuation.
  - **Sensor Reading:** HC-SR04 ultrasonic with hardware timer interrupts and software debounce.
  - **Serial Comms:** UART listener for commands from ESP32-CAM, acknowledgement responses.
  - **Failsafe:** Watchdog timer returns servos to home position if no heartbeat from ESP32-CAM within 5 seconds.

## 3. Mechanism Design: Rotate & Tilt

The sorting mechanism operates on a two-axis system:

1. **The Tray:** The central landing zone for waste.
2. **Servo 1 (Pan/Rotate):** Mounted vertically. It rotates the entire tray assembly to align the dropping edge with one of the three partitions (e.g., General, Recycling, Compost).
3. **Servo 2 (Tilt):** Mounted horizontally on the rotating assembly. It tilts the tray downwards to let gravity slide the item into the selected partition.

### Structural Design: Top Frame Method

To handle the bin bags cleanly without them interfering with the central servos:

- **Base Bin:** A single large 60L-75L rectangular container (Willow Dome Bin from Bunnings).
- **Top Plate:** A laser-cut piece of acrylic or 4mm MDF mounted across the top of the bin.
- **Drop Zones:** The top plate features three distinct cutouts/holes corresponding to General, Recycling, and Compost.
- **Bag Management:** Individual bin bags are pushed through each hole, folded back over the lip of the wood/acrylic, and secured tightly using bulldog/binder clips.
- **Mechanism Mounting:** The 3D printed servo pan/tilt bracket is mounted securely to the centre of this top plate.
- **Camera Arch:** A laser-cut arch extends above the tray, holding the ESP32-CAM and WS2812B LED ring at the correct height for consistent image capture.
- **Emptying:** The entire top plate lifts off, providing clear access to tie and remove the bags.

## 4. AI Classification: Cloud VLM

The ESP32-CAM captures an image and sends it to a cloud-hosted Vision Language Model for classification:

- **How it works:** The ESP32-CAM captures a JPEG, encodes it, and POSTs it to a VLM API endpoint (e.g., GPT-4o, Gemini, Llama Vision via OpenRouter). The VLM returns a JSON response with the waste category, item label, and confidence score.
- **Providers:** Multiple VLM providers are supported and configurable via the web dashboard (OpenRouter, OpenAI, Google Gemini, Ollama for local testing, or any OpenAI-compatible custom endpoint).
- **Latency:** ~1-2 seconds per classification (network dependent). Acceptable given the mechanical sort cycle adds ~0.7-1s, keeping the total under the <3s parameter target.
- **No training required:** Cloud VLMs are pre-trained and classify any everyday object out of the box.
- **Trade-off:** Requires WiFi connectivity. The system is designed for fixed indoor locations (schools, offices) where WiFi is reliably available.

> Design iteration history: the Design Iteration slides in `portfolio/ai_bin.js`.

## 5. Web Dashboard

The ESP32-CAM hosts a lightweight web server accessible from any device on the same network. The dashboard provides:

| Feature | Description |
| :--- | :--- |
| **Live Stats** | Items sorted, category breakdown (pie/bar chart), accuracy tracking over time |
| **Camera Feed** | Live or last-frame view with classification results |
| **System Health** | Uptime, inference latency, connectivity status |
| **Manual Controls** | Servo calibration sliders, manual sort trigger, home position reset |
| **LLM Settings** | Provider selection (OpenRouter/OpenAI/Gemini/Ollama/Custom), model ID, API key management |
| **Dataset Collection** | Save captured images for accuracy auditing, export as ZIP |
| **Model Comparison** | Run two VLM providers side-by-side on the same image |

### Technical Implementation
- **Backend:** Flask running on the ESP32-CAM (or on a PC in mock/development mode), serving a REST API.
- **Frontend:** Alpine.js for reactivity + Tailwind CSS for styling (both loaded via CDN -- zero build step). Uses Server-Sent Events (SSE) for real-time stats updates.
- **Data Persistence:** SQLite database for sorting history and statistics.
- **Access:** Available at `http://<esp32-cam-ip>:8080` on the local network. No authentication required for MVP (local network only).

## 6. Project Phases & Timeline

### Phase 1: Research & Procurement
- Finalise hardware selection based on current market prices.
- Order all electronic components from AliExpress.
- Source the base bin and structural materials locally.

### Phase 2: Mechanical Prototyping
- 3D print the pan/tilt bracket (MakerWorld model 973248).
- Design and laser-cut the top plate with three partition cutouts and camera arch.
- Test servo torque to ensure the MG996R can handle the tray with a heavy item.

### Phase 3: ESP32 Firmware
- Implement the UART serial protocol listener on the ESP32 DevKit.
- Write servo PWM control with configurable angles per waste category.
- Implement HC-SR04 sensor reading with debounce and interrupt-driven triggering.
- Add watchdog failsafe (home servos if ESP32-CAM heartbeat lost).

### Phase 4: ESP32-CAM Software
- Set up camera capture and WiFi connectivity.
- Implement cloud VLM API integration (HTTP POST with JPEG image, JSON response parsing).
- Implement UART communication to send sort commands to the ESP32 DevKit.
- Add WS2812B LED ring control for illumination and category feedback.

### Phase 5: Web Dashboard
- Build the Flask backend with REST API endpoints.
- Create the frontend dashboard (stats, camera feed, controls, settings).
- Set up SQLite for sorting history persistence.
- Implement provider configuration and model comparison features.

### Phase 6: System Integration
- Connect ESP32-CAM to ESP32 DevKit over UART.
- Develop the main control loop on the ESP32-CAM:
  1. Receive item detection event from ESP32 (sensor interrupt via UART).
  2. Turn on LED ring (white illumination).
  3. Capture an image with the OV2640 camera.
  4. Send image to cloud VLM, receive classification.
  5. Set LED ring to category colour (red/blue/green).
  6. Send sort command to ESP32 with target partition angle.
  7. ESP32 executes pan -> tilt -> home sequence.
  8. Log result to SQLite and broadcast to web dashboard via SSE.
- Assemble the electronics permanently on perfboard.

### Phase 7: Testing & Refinement
- Conduct end-to-end testing with real waste (50-item test batch).
- Verify UART reliability under sustained operation (100 consecutive sorts).
- Test web dashboard responsiveness and real-time updates.
- Identify edge cases (e.g., items getting stuck, VLM misclassifications) and refine the mechanical design or adjust VLM prompts.

> Evaluated alternatives and future directions: the Evaluation & Recommendations slide in `portfolio/ai_bin.js`.
