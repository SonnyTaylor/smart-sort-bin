# VCE Systems Engineering: Bill of Materials & Budget

All components are sourced with a strict focus on low-cost, high-value parts. The project is entirely self-funded.

## Component List

| Item | Qty | Estimated Cost (AUD) | Notes |
| :--- | :---: | :--- | :--- |
| ESP32-CAM (with OV2640 + CH340 programmer) | 1 | ~$12.00 | AI brain -- captures image, sends to cloud VLM via WiFi |
| ESP32 DevKit V1 | 1 | ~$8.67 | Real-time servo/sensor controller (UART to ESP32-CAM) |
| MG996R High-Torque Servo (180-degree, metal gear) | 2 | ~$10.50 | Pan and tilt actuation |
| HC-SR04 Ultrasonic Sensor | 1 | ~$3.51 | Item detection trigger |
| USB-C PD Trigger Board | 1 | ~$3.14 | Negotiates 5V from any USB-C PD charger |
| 1000uF 16V Electrolytic Capacitors | 1 pack | ~$1.40 | Servo power rail smoothing (prevents ESP32 brownouts) |
| WS2812B LED Ring (12 LED, 48mm, 5V) | 1 | ~$4.93 | Consistent camera illumination + category colour feedback |
| Dupont Jumper Wires (40-pin M-M & M-F) | 1 each | ~$6.73 | Wiring harness |
| Breadboard (400 point) | 1 | ~$3.96 | Prototyping |
| Screw Terminal Blocks (2-pin, 5.08mm) | 1 pack | ~$4.85 | Power distribution on perfboard |
| M3 Nylon Standoff Kit | 1 | ~$6.80 | Mounting PCBs (includes screws and nuts) |
| Heat Shrink Tubing Kit | 1 | ~$3.44 | Insulating permanent solder joints |
| Zip Ties (100mm) | 1 pack | ~$2.93 | Cable management |
| 3D Printed Pan/Tilt Bracket | 1 | ~$2.00 | MakerWorld model 973248, adapted for MG996R. Filament cost only. |
| Willow 60L Black Dome Bin (Base Only) | 1 | $15.99 | Bunnings (I/N: 9300621035605) |
| Laser Cutting Material (MDF/Acrylic) | -- | ~$15.00 | Top plate and camera arch |
| Bulldog Clips & Bin Bags | -- | ~$5.00 | Securing the 3 internal partitions |
| **Total** | | **~$110.85 AUD** | |

## Sourcing Notes

- All electronic components sourced from AliExpress for cost efficiency.
- Structural materials can be sourced locally (hardware store) or laser-cut at school.
- The ESP32-CAM replaces the need for an expensive edge AI board (MaixCAM ~$80, Jetson Nano ~$200+) by offloading classification to a cloud Vision Language Model via WiFi.
- The ESP32 DevKit adds ~$8.67 but provides dedicated real-time hardware control, preventing servo jitter caused by WiFi/HTTP activity on the ESP32-CAM.
- USB-C PD trigger board replaces a traditional barrel jack PSU -- uses any existing USB-C phone/laptop charger, reducing cost and simplifying wiring.
- Pan/tilt bracket is 3D printed from an open-source MakerWorld design rather than buying a premade aluminium kit (~$36), saving ~$34.
