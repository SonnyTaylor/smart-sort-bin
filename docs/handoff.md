# Handoff — Smart Bin Pi Prototype

## What This Is
AI-powered smart waste sorting bin running on a **Raspberry Pi 3B + USB webcam**. Servos direct items into the correct bin third. AI classification via cloud VLM (OpenRouter by default). Controlled from a single web dashboard.

## Current Branch
`pi-prototype` — branched from `master`

## Key Files (read these first)
| File | Why |
|------|-----|
| `docs/pi_prototype_setup.md` | Full hardware/software setup, wiring diagram, SSH method, troubleshooting |
| `docs/pi_prototype_todo.md` | What's done vs what's left |
| `docs/pi_cv2_hang.md` | cv2 import deadlock issue on Pi 3B (why we use v4l2 for capture) |
| `src/pi/hardware.py` | Real hardware layer: pigpio servos with slew-rate smoothing, v4l2 camera, LED |
| `src/web/app.py` | Flask app: pages + REST API + SSE |
| `src/web/animations.py` | Server-side keyframe animation engine (built-ins + custom sequences) |
| `src/web/database.py` | SQLite: sort history, calibration, sequences, LLM providers |
| `deploy.py` | Directory-sync deployment (upload src/ + restart Flask) |

## Pi Details
- **IP:** `192.168.0.88`
- **SSH:** `pi` / `Futiz$23`
- **Hostname:** `smartbin`
- **Flask:** port 8080, started with `--pi` flag
- **Dashboard:** http://192.168.0.88:8080/

## Hardware Status
- ✅ Pi booted, networked, SSH accessible
- ✅ USB webcam working (`/dev/video0`, v4l2 mmap streaming)
- ✅ Pan servo GPIO 17, Tilt servo GPIO 27
- ✅ pigpio daemon running (jitter-free servos)
- ✅ Pan-tilt bracket assembled
- ✅ 1000µF cap on 5V rail, external PD power
- ❌ Webcam not yet mounted on bracket
- ❌ LED ring not yet wired (GPIO 18, Pin 12)
- ⚠️ Servo slew smoothing (new motion thread in `hardware.py`) not yet tested on real servos — verify next time the Pi is powered

## Architecture Notes
- **Servo smoothing:** `set_pan/set_tilt` set *targets*; a 50Hz motion thread slews the actual pulsewidth toward them (`SLEW_RATE` in `hardware.py`). The animation engine bypasses slew with `immediate=True` since it generates its own eased steps.
- **Animations:** played server-side (`animations.py`) so they're smooth and survive the browser closing. Manual servo input or a sort interrupts playback.
- **Calibration:** bin positions + sequence timing live in SQLite (`calibration` key in `system_state`), editable in the dashboard's Calibration tab. `hardware.py` presets are fallbacks only.

## How to SSH (for the AI)
Use **paramiko** — interactive `ssh` hangs waiting for password. Example:
```python
import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('192.168.0.88', username='pi', password='Futiz$23')
```
For sudo, open a PTY and send the password string.

## How to Deploy
```bash
python deploy.py              # Upload src/ + restart Flask
python deploy.py --upload     # Upload only
python deploy.py --restart    # Restart Flask only
python deploy.py --status     # Check if everything's running
python deploy.py --logs       # Show Flask logs
python deploy.py --setup      # Install systemd services
```

## Dashboard Features
- **Servo control:** XY drag pad, sliders, keyboard (WASD), gamepad — all throttled client-side
- **Snap & Sort:** capture → classify → sort with real-time SSE progress
- **Animations:** built-in moves + custom keyframe sequences (editor with capture-position)
- **Calibration:** per-bin positions set from current head position, timing tuning, test dumps
- **Stats:** totals, breakdown, confidence/latency, 24h chart
- **Providers:** key/model management + connection tests, model comparison modal
- **LED control:** color swatches (no-op until ring is wired)

## Next Tasks (in order)
1. Mount USB webcam on pan-tilt bracket
2. Power the Pi and test the new servo slew smoothing on real hardware
3. Wire WS2812B LED ring to GPIO 18
4. Calibrate bin positions using the dashboard's Calibration tab
5. Test full "Snap & Sort" pipeline with real waste items
6. `python deploy.py --setup` for auto-start on boot
