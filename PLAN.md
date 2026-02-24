# Project Plan: AI-Powered Smart Bin (Systems Engineering 3&4)

## 1. Project Overview
- **Objective:** Develop a low-cost, AI-powered smart bin capable of automatically sorting waste into three distinct categories using a custom-trained YOLO11 object detection model.
- **Inspiration:** Ameru AI Bin.
- **Core Mechanism:** A rotating and tilting tray system driven by two servos to direct waste into one of the three internal partitions.
- **Constraint:** Self-funded, requiring a strict focus on low-cost, high-value components.

## 2. System Architecture

### Hardware Components (Low-Cost Focus)
- **Compute:** Sipeed MaixCAM Pro (~$86.99 AUD) - Provides a built-in neural processing unit (NPU) for high frame-rate YOLO object detection, an integrated camera, and a touchscreen LCD to display what the AI "thinks" the rubbish is. Replaces the need for a separate Raspberry Pi, camera, and screen.
- **Camera:** Integrated MaixCAM Pro Camera.
- **Actuators:** 2x High-Torque Standard Servos (e.g., MG996R). These are cheap but provide enough torque to handle the tray and the weight of typical waste items.
- **Sensors:** 
  - 1x Ultrasonic sensor (HC-SR04) or IR break-beam sensor to detect when an item is placed on the tray, triggering the camera and AI.
- **Power:** 
  - 5V Power supply for the MaixCAM Pro.
  - A separate buck converter or power supply for the servos to prevent voltage drops and brownouts on the Pi when the servos draw stall current.
- **Structure:** Repurposed standard bin with internal partitions made from cheap materials (corrugated plastic, thin MDF, or 3D printed parts).

### Software Stack
- **OS:** Linux (MaixCAM OS).
- **Computer Vision: Python, MaixPy, OpenCV.
- **AI Model:** Custom-trained YOLO11s (Small). Optimized for accuracy at 416x416 resolution, running via INT8 quantization on the MaixCAM Pro's 1 TOPS NPU. Since we only need ~1 FPS for the mechanical sort, the 'Small' model maximizes recognition capability without exceeding the board's 256MB RAM.
- **Hardware Control: Python/MaixPy libraries to manage servo PWM signals and read sensor inputs.
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
- **Mechanism Mounting:** The servo pan/tilt tray is mounted securely to the center of this top plate.
- **Emptying:** The entire top plate lifts off, providing clear access to tie and remove the bags.

## 4. AI & Model Training Strategy

1. **Data Collection:** Gather a diverse dataset of common waste items. *Crucially, take these photos on the actual tray under the lighting conditions the bin will experience.* This reduces domain shift.
2. **Annotation:** Use a free tool like Roboflow to label the dataset into the 3 target classes.
3. **Training:** Train a YOLO11s (Small) model at 416x416 resolution using Google Colab. We avoid YOLO26 due to NPU toolchain operator incompatibility, and we choose the 's' variant over 'n' to ensure better feature extraction for visually similar waste items.
4. **Optimization:** Export the model to ONNX (`opset=11`) and use Sipeed's MaixHub or Docker toolkit to convert it to an INT8 `.cvimodel` (or `.mud`) format.

## 5. Project Phases & Timeline

### Phase 1: Research & Procurement
- Finalize hardware selection based on current market prices.
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

## 6. Estimated Budget
| Item | Estimated Cost (AUD) |
| :--- | :--- |
| Sipeed MaixCAM Pro (AI + Camera + Screen) | ~$86.99 |
| 2x MG996R Servos | ~$15.12 |
| HC-SR04 Ultrasonic Sensor | ~$1.42 |
| 5V 5A Power Supply | ~$11.29 |
| Dupont Jumper Wires (40pin M-M & M-F) | ~$5.74 |
| Structural Materials | ~$30.00 |
| **Total Estimated Cost** | **~$150.56 AUD** |

## 7. Engineering Iteration & Optimization (Portfolio Case Study)

*Note for VCE Portfolio: This section documents the iterative design process, demonstrating how testing led to modifications to meet the system parameters.*

### Iteration 1: YOLO11-nano at 224x224 (Initial Prototype)
- **Implementation:** The initial AI vision subsystem was trained using the YOLO11n (Nano) model at 224x224 resolution to maximize FPS.
- **Testing & Evaluation:** The model ran extremely fast (20-25 FPS), but struggled to distinguish visually similar items (e.g., crumpled paper vs. crumpled plastic film) due to the low resolution and low parameter count.

### Research & Modification
- The mechanical pan-and-tilt sorting process inherently takes 1-3 seconds. Therefore, running the AI at 20+ FPS is unnecessary. The new requirement was defined as ~1 FPS with maximized accuracy.
- Research indicated that upgrading to YOLO11s (Small) at 416x416 resolution would drastically improve accuracy. However, larger models risk crashing the MaixCAM Pro's 256MB RAM if not properly quantized.

### Iteration 2: YOLO11s at 416x416 (Final Implementation)
- **Implementation:** Retrained the dataset using `yolo11s.pt` with `imgsz=416`. Exported to ONNX (`opset=11`) and quantized to INT8 `.cvimodel`. Implemented a `time.sleep(1)` in the Python loop to reduce thermal load and battery draw.
- **Testing & Results:** 
  1. **Accuracy Boost:** The higher parameter count (~3x more than Nano) and resolution allowed the model to successfully recognize complex waste geometries, securing the **> 90% Classification Accuracy** parameter.
  2. **Resource Management:** By keeping the resolution at 416x416 (instead of 640x640) and using INT8 quantization, the model fit perfectly within the 256MB RAM constraint without Out-Of-Memory (OOM) errors.

## 8. Evaluated Alternatives & Future Scope

As part of the Systems Engineering design process, several alternative system architectures were evaluated before settling on the localized Edge AI approach. These remain viable paths for future iterations:

### Alternative 1: Cloud Vision Language Models (VLMs)
- **Concept:** Replace the $86 MaixCAM Pro with an ultra-cheap internet-connected board (e.g., Raspberry Pi Zero W or ESP32-CAM). When rubbish is detected, take a photo and send it via Wi-Fi to a Cloud VLM API (e.g., `meta-llama/llama-4-scout` via OpenRouter).
- **VLM Specs:** The Llama-4-Scout model supports multi-modal image input and text output. On OpenRouter, it operates at ~338 Tokens Per Second (TPS) with 0.16s latency. The cost is negligible at $0.11 per 1M input tokens.
- **Why it was deferred:** While this would allow for infinite classification intelligence and "Ameru-style" granular UI (e.g., recognizing exactly a "Snickers Bar" rather than just "General Waste"), it introduces a critical dependency on continuous Wi-Fi. School networks often block IoT devices. The localized Edge AI (MaixCAM) was chosen to ensure 100% offline reliability.

### Alternative 2: Open-Source Hierarchical Datasets
- **Concept:** Continue using the MaixCAM Pro but train the YOLO11s model on an open-source dataset (like TACO - Trash Annotations in Context) which contains thousands of pre-labeled specific items (e.g., "crushed can", "tissue", "apple core") instead of our 3 broad bins.
- **Implementation:** A Python dictionary would act as middleware, mapping the specific YOLO detection (`"apple_core"`) to the correct servo output (`"compost"`).
- **Why it was deferred:** Training on an external dataset introduces "Domain Shift" (the backgrounds and lighting in the open-source photos don't match the inside of our specific bin tray). Taking a smaller, custom dataset on the actual tray ensures higher operational reliability for the baseline prototype.
