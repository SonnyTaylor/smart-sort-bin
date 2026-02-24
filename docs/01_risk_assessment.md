# VCE Systems Engineering: Risk Assessment

## Mechanical & Hardware Risks
| Hazard | Potential Harm | Risk Level | Control Measure / Mitigation |
| :--- | :--- | :--- | :--- |
| Pinch points in tray mechanism | Crushed fingers during operation | Medium | Enclose the rotating mechanism in the bin housing. Use low-torque stepper/servo motors that stall before causing injury. |
| High stall current on servos | Brownout of the AI processor, system crash | High | Use a dedicated 5V 5A power supply. Separate the power rails for the logic (MaixCAM + ESP32) and the actuators (Servos). |
| Component overheating | Fire hazard, component failure | Low | Ensure adequate ventilation in the electronics enclosure. Run the MaixCAM Pro at efficient voltage. |

## Software & AI Risks
| Hazard | Potential Harm | Risk Level | Control Measure / Mitigation |
| :--- | :--- | :--- | :--- |
| Model inference too slow | System fails < 3s sorting parameter, user frustration | High | Use edge-optimised YOLO11s (Small) with INT8 quantisation. Leverage NPU hardware acceleration instead of CPU inference. |
| Misclassification of waste | Contaminated recycling streams, failing the >90% parameter | Medium | Train model on a highly specific dataset collected *inside* the actual bin under the final LED lighting conditions. |
| Endless loop / sensor noise | Continuous mechanical actuation | Low | Implement software debounce on the ultrasonic sensor interrupt. Add timeout fail-safes in the main control loop. |

## Communication & Integration Risks
| Hazard | Potential Harm | Risk Level | Control Measure / Mitigation |
| :--- | :--- | :--- | :--- |
| UART communication failure | ESP32 misses sort command, item not sorted or sorted incorrectly | Medium | Implement ACK/NACK protocol with retry logic. ESP32 watchdog timer returns servos to home if no heartbeat received within 5 seconds. |
| MaixCAM crash during sort | Servos freeze in mid-sort position, potential jam or item stuck | Medium | ESP32 operates independently once a sort command is received (full pan-tilt-home sequence). Watchdog ensures safe state on MaixCAM failure. |
| Wi-Fi unavailable (LLM mode) | Cloud classification fails, system hangs waiting for API response | Low | Automatic fallback to local YOLO mode with a configurable API timeout (default 3 seconds). LLM mode is non-essential. |
| Web dashboard access by unintended users | Unauthorised mode changes or servo actuation | Low | Dashboard limited to local network only (no port forwarding). No sensitive data exposed. Manual controls require confirmation in the UI. |
