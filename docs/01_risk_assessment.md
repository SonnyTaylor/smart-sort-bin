# VCE Systems Engineering: Risk Assessment

## Mechanical & Hardware Risks
| Hazard | Potential Harm | Risk Level | Control Measure / Mitigation |
| :--- | :--- | :--- | :--- |
| Pinch points in tray mechanism | Crushed fingers during operation | Medium | Enclose the rotating mechanism in the bin housing. Use low-torque servo motors that stall before causing injury. |
| High stall current on servos | Brownout of the ESP32, system crash | High | Use 1000uF capacitors on the servo power rail. Separate the power traces for logic (ESP32-CAM + ESP32) and actuators (servos) on the perfboard. Use a USB-C PD charger rated at 20W+ (5V/3A minimum). |
| Component overheating | Fire hazard, component failure | Low | Ensure adequate ventilation in the electronics enclosure. ESP32-CAM and ESP32 DevKit both run at 3.3V logic with low thermal output. |

## Software & AI Risks
| Hazard | Potential Harm | Risk Level | Control Measure / Mitigation |
| :--- | :--- | :--- | :--- |
| Cloud VLM API latency too high | System fails < 3s sorting parameter, user frustration | Medium | Set a configurable API timeout (default 3 seconds). Choose low-latency VLM providers. LED ring provides visual feedback while classifying so users know the system is working. |
| Misclassification of waste | Contaminated recycling streams, failing the >90% parameter | Medium | Use high-quality VLMs (GPT-4o, Gemini, Llama Vision) which generalise well to everyday waste items without custom training. Consistent LED illumination reduces variability in camera input. |
| Endless loop / sensor noise | Continuous mechanical actuation | Low | Implement software debounce on the ultrasonic sensor interrupt. Add timeout fail-safes in the main control loop. |

## Communication & Integration Risks
| Hazard | Potential Harm | Risk Level | Control Measure / Mitigation |
| :--- | :--- | :--- | :--- |
| UART communication failure | ESP32 misses sort command, item not sorted or sorted incorrectly | Medium | Implement ACK/NACK protocol with retry logic. ESP32 watchdog timer returns servos to home if no heartbeat received within 5 seconds. |
| ESP32-CAM crash during sort | Servos freeze in mid-sort position, potential jam or item stuck | Medium | ESP32 operates independently once a sort command is received (full pan-tilt-home sequence). Watchdog ensures safe state on ESP32-CAM failure. |
| Wi-Fi unavailable | Cloud VLM classification fails, system cannot sort | High | System requires WiFi for classification. Deploy in locations with reliable WiFi. Display clear error on LED ring (e.g., red flash) if WiFi or API is unreachable so users know to use a regular bin. |
| Web dashboard access by unintended users | Unauthorised mode changes or servo actuation | Low | Dashboard limited to local network only (no port forwarding). No sensitive data exposed. Manual controls require confirmation in the UI. |
