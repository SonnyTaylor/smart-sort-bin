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
- [ ] Test LED ring colors from software
- [ ] Add physical power switch or shutdown button
- [ ] Enclose in temporary housing for demo

## Software
- [x] Real hardware abstraction (`src/pi/hardware.py`)
- [x] Servo slew-rate smoothing (50Hz motion thread — smooth manual control)
- [x] Single dashboard at `/` (clean dark UI, XY pad, throttled input)
- [x] Server-side animation engine + custom sequence editor
- [x] Bin calibration stored in DB, editable + testable from the dashboard
- [x] "Snap & Sort" pipeline: capture -> VLM classify -> calibrated sort -> LED
- [x] Model comparison (two providers on the same frame)
- [x] Stats view: totals, breakdown, confidence/latency, 24h chart
- [x] Gamepad + keyboard control routed through throttled sender
- [x] v4l2 mmap camera streaming (continuous, stable exposure)
- [x] Directory-sync deploy script (`deploy.py`)
- [ ] **Test servo slew smoothing on real hardware (Pi currently unplugged)**
- [ ] Auto-start Flask on boot (`python deploy.py --setup`)
- [ ] Calibrate servo positions for actual bin thirds (use Calibration tab)
- [ ] Add confidence threshold filter (ignore < 0.7)
- [ ] Error handling for camera disconnection
- [ ] LED animations once ring is wired

## AI / VLM
- [x] OpenRouter provider configured
- [x] Vision prompt optimized for Australian waste rules
- [x] Classify endpoint working with base64 webcam capture
- [ ] Test with real waste items under final lighting
- [ ] Compare model accuracy (use the dashboard's Compare modal)
- [ ] Fine-tune prompt for specific bin geometry

## Deployment
- [x] `deploy.py` directory sync (src/pi + src/web, skips venv/db/pycache)
- [x] systemd service files (`src/systemd/`, installed via `--setup`)
- [x] Documentation updated for the redesigned dashboard
- [ ] Backup SD card image before demo day

## Known Issues
- [ ] cv2 import deadlocks on Pi 3B if the apt version is installed — cv2 is no
      longer a dependency, but see `docs/pi_cv2_hang.md` if it comes back
- [ ] Servo range may need mechanical calibration after webcam is mounted
