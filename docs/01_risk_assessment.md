# VCE Systems Engineering: Risk Assessment

## Mechanical & Hardware Risks
| Hazard | Potential Harm | Risk Level | Control Measure / Mitigation |
| :--- | :--- | :--- | :--- |
| Pinch points in tray mechanism | Crushed fingers during operation | Medium | Enclose the rotating mechanism in the bin housing. Use low-torque stepper/servo motors that stall before causing injury. |
| High stall current on servos | Brownout of the AI processor, system crash | High | Use a dedicated 5V 5A power supply. Separate the power rails for the logic (MaixCAM) and the actuators (Servos). |
| Component overheating | Fire hazard, component failure | Low | Ensure adequate ventilation in the electronics enclosure. Run the MaixCAM Pro at efficient voltage. |

## Software & AI Risks
| Hazard | Potential Harm | Risk Level | Control Measure / Mitigation |
| :--- | :--- | :--- | :--- |
| Model inference too slow | System fails < 3s sorting parameter, user frustration | High | Use edge-optimized YOLO11s (Small) with INT8 quantization. Leverage NPU hardware acceleration instead of CPU inference. |
| Misclassification of waste | Contaminated recycling streams, failing the >90% parameter | Medium | Train model on a highly specific dataset collected *inside* the actual bin under the final LED lighting conditions. |
| Endless loop / sensor noise | Continuous mechanical actuation | Low | Implement software debounce on the ultrasonic sensor interrupt. Add timeout fail-safes in the main control loop. |
