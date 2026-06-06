# Pi Prototype — TODO

## Hardware
- [x] Raspberry Pi 3B booted and networked (192.168.0.88)
- [x] USB webcam detected and capturing (`/dev/video0`)
- [x] Pan servo wired to GPIO 17 (Pin 11)
- [x] Tilt servo wired to GPIO 27 (Pin 13)
- [x] 1000µF capacitor on 5V rail
- [x] Common ground via breadboard power rail
- [x] External 5V from USB-C PD board (set to 5V!)
- [x] Pan-tilt bracket physically assembled
- [x] Servo jitter fixed (pigpio hardware-timed PWM)
- [ ] Mount USB webcam on pan-tilt bracket
- [ ] Wire WS2812B LED ring to GPIO 18 (Pin 12)
- [ ] Add LED ring to breadboard power rail
- [ ] Test LED ring colors from software
- [ ] Add physical power switch or shutdown button
- [ ] Enclose in temporary housing for demo

## Software
- [x] `src/pi/hardware.py` — real hardware abstraction
- [x] `src/web/config.py` — `PI_MODE = True`, `MOCK_MODE = False`
- [x] `src/web/app.py` — hardware API endpoints wired to real servos/camera
- [x] `src/web/templates/pi_dashboard.html` — basic control UI
- [x] Flask server running on Pi port 8080
- [x] pigpio daemon installed and running (no servo jitter)
- [x] MJPEG camera stream endpoint
- [x] "Snap & Sort" pipeline: capture -> LLM classify -> servo move -> LED flash
- [ ] Auto-start Flask on boot (systemd service)
- [ ] Add camera preview auto-refresh if stream is slow
- [ ] Add joystick-style slider for finer pan/tilt control
- [ ] Add confidence threshold filter (ignore < 0.7)
- [ ] Cache OpenRouter API responses for repeated objects
- [ ] Add image saving toggle (dataset collection on/off)
- [ ] Error handling for camera disconnection

## AI / LLM
- [x] OpenRouter provider configured
- [x] Vision prompt optimized for Australian waste rules
- [x] Classify endpoint working with base64 webcam capture
- [ ] Test with real waste items under final lighting
- [ ] Compare model accuracy (Scout vs Flash vs GPT-4o-mini)
- [ ] Fine-tune prompt for specific bin geometry

## Deployment
- [ ] systemd service file for auto-start
- [ ] `requirements.txt` for Pi (Flask, httpx, pigpio, rpi_ws281x, opencv)
- [ ] Document re-deploy steps (SD card flash, first boot script)
- [ ] Backup SD card image before demo day

## Known Issues
- [ ] gpiozero warning still appears on import (harmless, pigpio overrides it)
- [ ] Camera stream sometimes shows gray frame on first load (OpenCV warmup)
- [ ] Servo range may need mechanical calibration after webcam is mounted
