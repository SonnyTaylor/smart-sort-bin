# VCE Systems Engineering: Bill of Materials & Budget

All components are sourced with a strict focus on low-cost, high-value parts. The project is entirely self-funded.

## Component List

| Item | Qty | Estimated Cost (AUD) | Notes |
| :--- | :---: | :--- | :--- |
| Sipeed MaixCAM Pro | 1 | ~$86.99 | AI compute + camera + LCD screen + Wi-Fi |
| ESP32 DevKit V1 | 1 | ~$4.50 | Real-time servo/sensor controller (UART to MaixCAM) |
| MG996R High-Torque Servo | 2 | ~$15.12 | Pan and tilt actuation |
| HC-SR04 Ultrasonic Sensor | 1 | ~$1.42 | Item detection trigger |
| 5V 5A Power Supply | 1 | ~$11.29 | Main system power |
| Dupont Jumper Wires (40-pin M-M & M-F) | 1 | ~$5.74 | Wiring harness |
| Willow 60L Black Dome Bin (Base Only) | 1 | $15.99 | Bunnings (I/N: 9300621035605) |
| Laser Cutting Material (MDF/Acrylic) | -- | ~$15.00 | Top plate and camera arch |
| Fasteners (M3 standoffs, nuts, bolts) | 1 | ~$5.00 | Mounting boards and servos |
| Aluminium Pan/Tilt Servo Bracket Set | 1 | $17.99 | For MG996R (Amazon AU) |
| 5V LED Strip / Ring Light | 1 | ~$5.00 | Consistent illumination for AI |
| DC Barrel Jack Terminal & Perfboard | 1 | ~$4.00 | Power distribution and stable ESP32 wiring |
| Bulldog Clips & Bin Bags | -- | ~$5.00 | Securing the 3 internal partitions |
| **Total** | | **~$175.05 AUD** | |

## Sourcing Notes

- All electronic components sourced from AliExpress for cost efficiency.
- Structural materials can be sourced locally (hardware store) or laser-cut at school.
- The MaixCAM Pro replaces the need for a separate Raspberry Pi, camera module, and display -- significantly reducing both cost and wiring complexity.
- The ESP32 adds ~$4.50 but provides dedicated real-time hardware control, preventing servo jitter caused by AI inference load on the MaixCAM.
