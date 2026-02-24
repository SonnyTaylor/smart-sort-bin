# VCE Systems Engineering: Iteration Log

*This document records the iterative design process for the AI vision subsystem, demonstrating how testing led to modifications to meet the system parameters.*

---

## Iteration 1: YOLO11n (Nano) at 224x224

### Implementation
The initial AI vision subsystem used the YOLO11n (Nano) model trained at 224x224 resolution. The goal was to maximise frames per second (FPS) for real-time detection.

### Testing & Evaluation
- **Speed:** The model ran at 20-25 FPS on the MaixCAM Pro's NPU.
- **Accuracy:** The model struggled to distinguish visually similar items (e.g., crumpled paper vs. crumpled plastic film) due to the low resolution and low parameter count.
- **Verdict:** Speed far exceeded requirements, but accuracy fell short of the >90% parameter.

---

## Research & Modification

The mechanical pan-and-tilt sorting process inherently takes 1-3 seconds. Running the AI at 20+ FPS provides no benefit when the bottleneck is mechanical. The revised requirement was defined as:

> ~1 FPS inference with maximised classification accuracy.

Research indicated that upgrading to YOLO11s (Small) at 416x416 resolution would drastically improve accuracy. However, larger models risk crashing the MaixCAM Pro's 256MB RAM if not properly quantised.

---

## Iteration 2: YOLO11s (Small) at 416x416 -- Final Implementation

### Implementation
- Retrained the dataset using `yolo11s.pt` with `imgsz=416`.
- Exported to ONNX (`opset=11`) and quantised to INT8 `.cvimodel`.
- Added `time.sleep(1)` in the Python control loop to reduce thermal load and power draw.

### Testing & Results

| Parameter | Target | Result |
| :--- | :--- | :--- |
| Classification Accuracy | >90% | Achieved. The higher parameter count (~3x more than Nano) and resolution resolved misclassifications of complex waste geometries. |
| RAM Usage | <256MB | Passed. INT8 quantisation at 416x416 (not 640x640) kept memory within bounds with no OOM errors. |
| Inference Speed | ~1 FPS | Met. Acceptable given the mechanical sorting bottleneck. |
