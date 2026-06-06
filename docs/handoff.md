# Handoff — Smart Bin Pi Prototype

## What This Is
AI-powered smart waste sorting bin running on a **Raspberry Pi 3B + USB webcam**. Servos direct items into the correct bin third. AI classification via OpenRouter. Controlled from a full-featured web dashboard.

## Current Branch
`pi-prototype` — branched from `master`

## Key Files (read these first)
| File | Why |
|------|-----|
| `docs/pi_prototype_setup.md` | Full hardware/software setup, wiring diagram, SSH method, troubleshooting |
| `docs/pi_prototype_todo.md` | What's done vs what's left |
| `docs/pi_cv2_hang.md` | cv2 import deadlock issue on Pi 3B (important!) |
| `src/pi/hardware.py` | Real hardware layer (servos via pigpio, v4l2 camera, LED ring) |
| `src/web/app.py` | Flask app with hardware API endpoints |
| `src/web/config.py` | `PI_MODE = True`, `MOCK_MODE = False` |
| `src/web/templates/pi_dashboard.html` | Full dashboard UI (HTMX + Tailwind) |
| `deploy.py` | Deployment script (upload files + restart Flask) |

## Pi Details
- **IP:** `192.168.0.88`
- **SSH:** `pi` / `Futiz$23`
- **Hostname:** `smartbin`
- **Flask:** running on port 8080
- **Dashboard:** http://192.168.0.88:8080/pi

## Hardware Status
- ✅ Pi booted, networked, SSH accessible
- ✅ USB webcam working (`/dev/video0`, v4l2 mmap streaming)
- ✅ Pan servo GPIO 17, Tilt servo GPIO 27
- ✅ pigpio daemon running (jitter-free servos)
- ✅ Pan-tilt bracket assembled
- ✅ 1000µF cap on 5V rail, external PD power
- ❌ Webcam not yet mounted on bracket
- ❌ LED ring not yet wired (GPIO 18, Pin 12)

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
python deploy.py              # Upload all files + restart Flask
python deploy.py --upload     # Upload only
python deploy.py --restart    # Restart Flask only
python deploy.py --status     # Check if everything's running
python deploy.py --logs       # Show Flask logs
```

## Dashboard Features
- **Servo control:** D-pad, sliders, number inputs, keyboard (WASD), gamepad (PS5/Xbox)
- **Bin presets:** Visual layout, two-stage sort (pan → dump → return → home)
- **Snap & Sort:** Capture → classify → sort with real-time SSE progress
- **LED control:** Color presets, pulse animation (placeholder until wired)
- **System health:** CPU temp, uptime, pigpio status
- **Provider settings:** API key, model selection, connection test
- **Dataset management:** Save frames, export ZIP, clear
- **Activity log:** Real-time SSE updates, filter by category
- **Debug panel:** API tester, SSE event log

## Sort Sequence
1. 📷 Camera classifies item (LED = blue)
2. ↔️ Pan to correct bin third (LED = yellow)
3. ↕️ Tilt to dump item (LED = category color)
4. ↕️ Tilt back to rest
5. ↔️ Pan back to center

## Next Tasks (in order)
1. Mount USB webcam on pan-tilt bracket
2. Wire WS2812B LED ring to GPIO 18
3. Test full "Snap & Sort" pipeline with real waste items
4. Add auto-start systemd service
5. Calibrate servo positions for bin thirds
