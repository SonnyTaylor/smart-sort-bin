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
- [x] `src/web/templates/pi_dashboard.html` — full dashboard UI (HTMX + Tailwind)
- [x] Flask server running on Pi port 8080
- [x] pigpio daemon installed and running (no servo jitter)
- [x] v4l2 mmap camera streaming (continuous, stable exposure)
- [x] "Snap & Sort" pipeline: capture -> LLM classify -> two-stage sort -> LED
- [x] Gamepad support (DualSense, Xbox) with deadzone filtering
- [x] Keyboard shortcuts (WASD, 1/2/3, H, Space)
- [x] Number inputs for precise pan/tilt values
- [x] Bin presets with visual layout diagram
- [x] SSE real-time progress during sort (classifying → panning → dumping → done)
- [x] Deploy script (`deploy.py`)
- [x] cv2 import hang documented and worked around (v4l2 instead)
- [ ] Auto-start Flask on boot (systemd service)
- [ ] Calibrate servo positions for actual bin thirds
- [ ] Add confidence threshold filter (ignore < 0.7)
- [ ] Cache OpenRouter API responses for repeated objects
- [ ] Add image saving toggle (dataset collection on/off)
- [ ] Error handling for camera disconnection
- [ ] LED animations once ring is wired

## AI / LLM
- [x] OpenRouter provider configured
- [x] Vision prompt optimized for Australian waste rules
- [x] Classify endpoint working with base64 webcam capture
- [ ] Test with real waste items under final lighting
- [ ] Compare model accuracy (Scout vs Flash vs GPT-4o-mini)
- [ ] Fine-tune prompt for specific bin geometry

## Deployment
- [x] `deploy.py` script for easy Pi deployment
- [x] Documentation updated
- [ ] systemd service file for auto-start
- [ ] `requirements.txt` for Pi (Flask, httpx, pigpio)
- [ ] Document re-deploy steps (SD card flash, first boot script)
- [ ] Backup SD card image before demo day

## Known Issues
- [ ] cv2 import deadlocks on Pi 3B — use v4l2 instead (see docs/pi_cv2_hang.md)
- [x] Camera stream was dark/flashing — fixed with v4l2 mmap continuous streaming
- [ ] Servo range may need mechanical calibration after webcam is mounted
