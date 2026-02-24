# Project Plan: AI-Powered Smart Bin (Systems Engineering 3&4)

## 1. Project Overview

- **Objective:** Develop a low-cost, AI-powered smart bin capable of automatically sorting waste into three distinct categories using a custom-trained YOLO11 object detection model.
- **Inspiration:** Ameru AI Bin.
- **Core Mechanism:** A rotating and tilting tray system driven by two servos to direct waste into one of the three internal partitions.
- **Constraint:** Self-funded, requiring a strict focus on low-cost, high-value components.

## 2. System Architecture

### Hardware Components (Low-Cost Focus)

- **Compute:** Sipeed MaixCAM Pro (~$86.99 AUD) -- Provides a built-in neural processing unit (NPU) for high frame-rate YOLO object detection, an integrated camera, and a touchscreen LCD to display what the AI "thinks" the rubbish is. Replaces the need for a separate Raspberry Pi, camera, and screen.
- **Camera:** Integrated MaixCAM Pro Camera.
- **Actuators:** 2x High-Torque Standard Servos (e.g., MG996R). Cheap but provide enough torque to handle the tray and the weight of typical waste items.
- **Sensors:** 1x Ultrasonic sensor (HC-SR04) or IR break-beam sensor to detect when an item is placed on the tray, triggering the camera and AI.
- **Power:**
  - 5V Power supply for the MaixCAM Pro.
  - A separate buck converter or power supply for the servos to prevent voltage drops and brownouts when the servos draw stall current.
- **Structure:** Repurposed standard bin with internal partitions made from cheap materials (corrugated plastic, thin MDF, or 3D printed parts).

> Full bill of materials and budget breakdown: [`docs/03_budget.md`](docs/03_budget.md)

### Software Stack

- **OS:** Linux (MaixCAM OS).
- **Computer Vision:** Python, MaixPy, OpenCV.
- **AI Model:** Custom-trained YOLO11s (Small). Optimised for accuracy at 416x416 resolution, running via INT8 quantisation on the MaixCAM Pro's 1 TOPS NPU. Since we only need ~1 FPS for the mechanical sort, the 'Small' model maximises recognition capability without exceeding the board's 256MB RAM.
- **Hardware Control:** Python/MaixPy libraries to manage servo PWM signals and read sensor inputs.
- **UI:** MaixPy display libraries to show the live camera feed and YOLO bounding boxes/confidence scores on the integrated screen.

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

## 4. AI & Model Training Strategy

1. **Data Collection:** Gather a diverse dataset of common waste items. *Crucially, take these photos on the actual tray under the lighting conditions the bin will experience.* This reduces domain shift.
2. **Annotation:** Use a free tool like Roboflow to label the dataset into the 3 target classes.
3. **Training:** Train a YOLO11s (Small) model at 416x416 resolution using Google Colab. We avoid YOLO26 due to NPU toolchain operator incompatibility, and we choose the 's' variant over 'n' to ensure better feature extraction for visually similar waste items.
4. **Optimisation:** Export the model to ONNX (`opset=11`) and use Sipeed's MaixHub or Docker toolkit to convert it to an INT8 `.cvimodel` (or `.mud`) format.

> Iteration history and model comparison: [`docs/04_iteration_log.md`](docs/04_iteration_log.md)

## 5. Project Phases & Timeline

### Phase 1: Research & Procurement
- Finalise hardware selection based on current market prices.
- Order all electronic components.
- Source the base bin and structural materials.

### Phase 2: Mechanical Prototyping
- Design the 3-partition layout for the inside of the bin.
- Build a prototype of the rotate/tilt mechanism (cardboard or 3D printed).
- Test servo torque to ensure they can lift the tray with a heavy item (like a full water bottle).

### Phase 3: AI Development
- Set up the camera and gather the initial image dataset.
- Annotate the dataset and train the first version of the YOLO model.
- Test the model's accuracy and inference speed on the MaixCAM Pro. Develop UI code to display bounding boxes and text.

### Phase 4: System Integration
- Assemble the electronics permanently.
- Develop the main Python control loop:
  1. Wait for item detection (sensor interrupt).
  2. Capture an image.
  3. Run YOLO inference.
  4. Map the highest confidence class to a specific partition angle.
  5. Command Servo 1 to rotate to that angle.
  6. Command Servo 2 to tilt, dropping the item.
  7. Return servos to the home position.

### Phase 5: Testing & Refinement
- Conduct end-to-end testing with real waste.
- Identify edge cases (e.g., items getting stuck, misclassifications) and refine the mechanical design or retrain the model with the failure cases.

> Evaluated alternatives and future directions: [`docs/05_future_scope.md`](docs/05_future_scope.md)
