# Pi Prototype — Setup Notes

## Architecture Overview

We pivoted from the original ESP32-CAM + ESP32-C3 dual-board design to a **standalone Raspberry Pi 3B** running everything:

- **USB webcam** for image capture
- **OpenRouter API** for AI waste classification
- **GPIO servos** (pan/tilt) via pigpio hardware PWM
- **WS2812B LED ring** for status indication
- **Flask web dashboard** for manual control and monitoring

## Hardware

### Components
| Part | Spec | Notes |
|------|------|-------|
| Raspberry Pi 3B | 1GB RAM, 4× USB | Main controller |
| USB Webcam | Generic 640×480 | `/dev/video0` via OpenCV |
| Pan Servo | MG996R | GPIO 17 (Pin 11), signal only |
| Tilt Servo | MG996R | GPIO 27 (Pin 13), signal only |
| LED Ring | WS2812B 16-LED | GPIO 18 (Pin 12), signal only |
| Capacitor | 1000µF electrolytic | Across 5V/GND rail near servos |
| Power | USB-C PD trigger board | Set to **5V ONLY** |

### Wiring
```
PD Board 5V+  ──►  Breadboard RED rail  (+)
PD Board GND  ──►  Breadboard BLUE rail (-)

Pi Pin 2  (5V)   ◄── Breadboard RED rail
Pi Pin 6  (GND)  ◄── Breadboard BLUE rail

Servo 1 (Pan):
  Red    ──► Breadboard RED
  Brown  ──► Breadboard BLUE
  Signal ──► Pi Pin 11 (GPIO 17)

Servo 2 (Tilt):
  Red    ──► Breadboard RED
  Brown  ──► Breadboard BLUE
  Signal ──► Pi Pin 13 (GPIO 27)

LED Ring:
  5V     ──► Breadboard RED
  GND    ──► Breadboard BLUE
  DIN    ──► Pi Pin 12 (GPIO 18)

Capacitor:
  + leg  ──► Breadboard RED
  - leg  ──► Breadboard BLUE (stripe side)
```

### Power Rules
- **PD board must be set to 5V.** Other voltages will destroy the Pi.
- **Do NOT power servos or LEDs from Pi GPIO pins.** Use the external 5V rail.
- **Common ground is automatic** because everything shares the breadboard GND rail.
- **1000µF capacitor** prevents brownouts when servos start moving.

## Pi Configuration

### OS
- Raspberry Pi OS Lite (64-bit)
- Hostname: `smartbin`
- Username: `pi`
- Password: `Futiz$23`
- WiFi: `OPTUS_7F6190N` / `brood69634fn`
- Static IP: `192.168.0.88`

### Installed Packages
```bash
sudo apt install -y python3-pip python3-venv v4l-utils libopenjp2-7
pip install flask httpx pigpio paramiko --break-system-packages
```

**OpenCV:** No longer required — camera capture uses `v4l2-ctl` directly.
(If you ever need cv2 on the Pi 3B, use pip's `opencv-python-headless`, never the apt version — see `docs/pi_cv2_hang.md`.)

### pigpio Daemon
The daemon must be running for jitter-free servo control:
```bash
sudo pigpiod
```
To verify: `ps aux | grep pigpiod`

## How I SSH to the Pi

### Why Paramiko?
I am an AI assistant running in a tool environment. Standard interactive `ssh` commands hang waiting for password input because there is no TTY for me to type into. `sshpass` is not installed. `plink` timed out.

**Paramiko** (Python SSH library) works because it handles authentication programmatically:
```python
import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('192.168.0.88', username='pi', password='Futiz$23')
stdin, stdout, stderr = client.exec_command('whoami')
print(stdout.read().decode())
```

For **sudo** commands, I open a PTY and send the password:
```python
transport = client.get_transport()
chan = transport.open_session()
chan.get_pty()
chan.exec_command('sudo apt update')
chan.send('Futiz$23\n')
```

## Software Stack

### File Structure on Pi
```
/home/pi/smartbin/
└── src/
    ├── pi/
    │   ├── __init__.py
    │   └── hardware.py       # Servos (pigpio + slew smoothing), v4l2 camera, LED
    └── web/
        ├── app.py            # Flask API + dashboard routes
        ├── animations.py     # Server-side keyframe animation engine
        ├── config.py         # --mock / --pi mode flags
        ├── database.py       # SQLite: history, calibration, sequences, providers
        ├── llm.py            # VLM provider abstraction
        ├── templates/pi/     # Dashboard templates + partials
        └── static/           # app.css + js/pi/ modules
```

### File Structure Locally
```
smart-sort-bin/
├── deploy.py               # Deployment script (directory sync + restart)
├── docs/
│   ├── handoff.md          # Main handoff doc
│   ├── pi_prototype_setup.md
│   ├── pi_prototype_todo.md
│   └── pi_cv2_hang.md      # cv2 deadlock issue
└── src/                    # Same as Pi
```

### Key Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Dashboard |
| `/api/health` | GET | CPU temp, uptime, WiFi, pigpio status |
| `/api/camera/stream` | GET | MJPEG live stream (v4l2 mmap) |
| `/api/servos` | GET | Current position + targets |
| `/api/servos/move` | POST | `{"pan": -1..1, "tilt": -1..1}` (either optional) |
| `/api/home` | POST | Center both servos |
| `/api/led` | POST | `{"color": "red|yellow|green|blue|purple|white|off"}` |
| `/api/sort` | POST | Full sort: capture -> classify -> pan -> dump -> home |
| `/api/classify` | POST | Classify base64 image or device capture |
| `/api/compare` | POST | Same frame through two providers in parallel |
| `/api/animations` | GET | Built-ins + saved sequences + playback state |
| `/api/animations/play` | POST | `{"name"}` or `{"id"}` or `{"keyframes": [...]}` |
| `/api/animations/stop` | POST | Stop playback |
| `/api/animations/custom` | POST/DELETE | Save / delete custom sequences |
| `/api/calibration` | GET/PUT | Bin positions + sequence timing |
| `/api/calibration/test/<cat>` | POST | Run the full sort sequence for a bin |
| `/api/events` | GET | SSE stream for real-time updates |
| `/api/stats`, `/api/stats/hourly`, `/api/history` | GET | Sort statistics |
| `/api/providers` | GET/PATCH | LLM provider settings |

### Starting the Server
```bash
cd /home/pi/smartbin/src/web
python3 -u app.py --pi
```
Runs on `http://192.168.0.88:8080`

## Servo Control

### Why pigpio?
- **gpiozero software PWM** = CPU-timed pulses → jittery servos, coil whine
- **pigpio hardware PWM** = DMA-timed pulses → rock solid, zero jitter

### pigpio vs gpiozero Pulsewidths
| Position | gpiozero `value` | pigpio pulsewidth (µs) |
|----------|-----------------|------------------------|
| Full left | -1.0 | 500 |
| Center | 0.0 | 1500 |
| Full right | 1.0 | 2500 |

### Category Presets (Bin Layout)
Bin is divided into 3 thirds (top-down view):
```
┌───────────┬───────────┬───────────┐
│           │           │           │
│  GENERAL  │ RECYCLING │  COMPOST  │
│  pan -0.7 │  pan  0.0 │  pan +0.7 │
│     🗑️    │    ♻️     │    🌱     │
└───────────┴───────────┴───────────┘
              ▲ mechanism
```

### Sort Sequence
1. ↔️ Pan to bin third
2. ↕️ Tilt to dump (tilt_dump = -0.6)
3. ↕️ Tilt back to rest (tilt_rest = 0.0)
4. ↔️ Pan back to center

### Tuning
Edit `CATEGORY_PRESETS` in `src/pi/hardware.py` to adjust:
- `pan`: position over each bin third
- `tilt_dump`: how far to tip for item to slide off
- `tilt_rest`: horizontal position
- Timing: `SORT_PAN_SETTLE_S`, `SORT_DUMP_HOLD_S`, `SORT_RETURN_S`

## LED States (when wired)
| State | Color |
|-------|-------|
| Idle | White (dim) |
| Capturing/Classifying | Blue |
| Sorting (panning) | Yellow |
| General waste | Red |
| Recycling | Yellow |
| Compost | Green |
| Error | Purple |

## Troubleshooting

### Pi won't boot (blinking red LED)
- PD board is not set to 5V. Check dip switches.

### Camera not detected
- `ls /dev/video*` should show `/dev/video0` plus internal Pi devices
- If only internal devices (video10+), webcam is not plugged in or not powered

### cv2 import hangs (FIXED)
- The apt `python3-opencv` (4.10.0) deadlocks on import — do NOT use it
- Fix: `pip install opencv-python-headless` (4.13.0 works fine)
- See `docs/pi_cv2_hang.md` for details

### Camera stream dark/flashing
- Camera needs time for auto-exposure to adjust
- v4l2 mmap mode keeps camera open continuously (fixed)
- First 5 frames are skipped (warmup)

### Servos jitter
- pigpiod is not running. Start it: `sudo pigpiod`
- gpiozero fallback is active. Check `hardware.py` uses pigpio.

### Flask won't start
- Check log: `cat /tmp/flask.log`
- Port 8080 in use: `pkill -9 -f "python3.*app.py"` then restart

### "GPIO busy" error
- Another process is holding the GPIO pin. Kill old servo scripts: `pkill -f hold_`

### Gamepad not working
- Press a button to wake it up (auto-detected via Gamepad API)
- Check browser console for `[GP]` logs
- Only works over HTTPS or localhost (browser security)

## Deployment
Use `deploy.py` to push code to the Pi:
```bash
python deploy.py              # Upload + restart
python deploy.py --status     # Check if running
python deploy.py --logs       # View Flask logs
```

## Git Branch
All Pi prototype work lives on the **`pi-prototype`** branch (branched from `master`).
