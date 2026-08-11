# Documentation Index

All project documentation for the AI Smart Bin VCE Systems Engineering portfolio.

| # | Document | Description |
| :---: | :--- | :--- |
| 01 | [Risk Assessment](01_risk_assessment.md) | Mechanical, hardware, software, and comms risk analysis with control measures |
| 02 | [Testing Plan](02_testing_plan.md) | Evaluation procedures for accuracy, sorting time, power, UART reliability, and web dashboard |
| 03 | [Budget & BOM](03_budget.md) | Full bill of materials with sourcing notes and cost breakdown |
| 04 | [Iteration Log: AI](04_iteration_log.md) | Why the classifier moved from a custom YOLO model on an edge AI board to a cloud VLM |
| 05 | [Future Scope](05_future_scope.md) | Enhancement directions: hierarchical datasets, multi-bin networks, on-device retraining |
| 06 | [Serial Protocol](06_serial_protocol.md) | UART command specification, from the two-board ESP32 design |
| 07 | [Mechanical Design](07_mechanical_design.md) | How the sorting mechanism works and why it is shaped that way, with verified clearances |
| 08 | [Iteration Log: Mechanical](08_mechanical_iteration_log.md) | Eight faults found and corrected before printing, and how each was caught |

---

## Build and setup notes

| Document | Description |
| :--- | :--- |
| [Pi Prototype Setup](pi_prototype_setup.md) | Wiring, OS configuration, troubleshooting |
| [Pi Prototype TODO](pi_prototype_todo.md) | Outstanding hardware, software and AI tasks |
| [Handoff](handoff.md) | Current state, how to deploy, next tasks |
| [cv2 hang](pi_cv2_hang.md) | The OpenCV capture hang and its fix |

See also [`../cad/README.md`](../cad/README.md) for the parts, hardware list and
assembly order, and [Project Plan](../PLAN.md) for the original system
architecture.

---

## Two known gaps

**Document 04 stops at the ESP32.** It records the move from a custom YOLO model
to a cloud VLM, and names the ESP32-CAM as the final implementation. The build
has since moved to a Raspberry Pi 3B. The root README already points at this
document for that pivot, so the ESP32 to Pi iteration still needs writing up.

**Document 06 describes the two-board serial protocol** between the ESP32-CAM and
the ESP32 DevKit. The Pi runs everything in one process, so this is history
rather than current design.
