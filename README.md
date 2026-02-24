# AI-Powered Smart Bin

![Smart Bin Concept](https://img.shields.io/badge/Status-Prototyping-orange.svg)
![VCE Systems Engineering](https://img.shields.io/badge/VCE-Systems_Engineering-blue.svg)

An AI-powered waste sorting system that eliminates recycling contamination at the point of disposal. Developed for VCE Systems Engineering Unit 3 & 4.

## Core Features
* **Automated Sorting:** Self-sorting mechanism using a 2-servo (Pan & Tilt) central tray.
* **Edge AI Vision:** Real-time object detection using YOLO26 running entirely on the device.
* **Cost Effective:** Achieves advanced AI capabilities for ~$150 AUD.
* **Closed-Loop Control:** Uses computer vision to actively guide the mechanical actuators.

## Hardware Stack
* **Brain:** Sipeed MaixCAM Pro (RISC-V + NPU)
* **Actuators:** 2x MG996R High-Torque Servos
* **Sensors:** HC-SR04 Ultrasonic Distance Sensor
* **Power:** 5V 5A Supply

## Software Stack
* MaixCAM OS (Linux)
* Python + MaixPy
* Ultralytics YOLO26
* OpenCV

## Project Structure
* `/docs` - System design and VCE portfolio documentation
* `/src` - Source code for MaixCAM AI and motor control (coming soon)
* `/models` - YOLO26 trained weights and ONNX/Kmodel conversions (coming soon)
* `/cad` - 3D printable files for the mechanical tray assembly (coming soon)

---
*Inspired by the Ameru AI Bin*
