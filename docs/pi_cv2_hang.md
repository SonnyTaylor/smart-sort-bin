# Pi 3B — cv2 Import Hang Issue

## Problem
`import cv2` (OpenCV) **deadlocks the entire Python process** on the Pi 3B when using the system-installed `opencv` package (v4.10.0 via `python3-opencv` apt package).

## Symptoms
- Flask starts but produces no output, no log, doesn't bind to port
- `python3 -c "import cv2"` hangs forever
- CPU spikes to 100% on the python process
- `ps aux` shows python in `R` state but never progresses

## Root Cause
The system `opencv` package at `/usr/lib/python3/dist-packages/cv2.cpython-313-aarch64-linux-gnu.so` likely tries to initialize GTK/Qt display backends on import, which hangs when there's no display server running (headless Pi).

## Affected
- **Package:** `opencv` 4.10.0 (apt `python3-opencv`)
- **Python:** 3.13.5 (aarch64)
- **OS:** Debian 13 (trixie), kernel 6.12.75+rpt-rpi-v8
- **Device:** Raspberry Pi 3B, headless (no display)

## Workaround
Removed `cv2` dependency entirely. Camera uses **fswebcam** (CLI tool) instead:
- Captures one JPEG frame per call via `subprocess`
- ~3 fps stream (vs ~10 fps with cv2)
- Reliable, no import issues
- Install with: `sudo apt install fswebcam`

## Files Changed
- `src/pi/hardware.py` — `Camera` class uses `fswebcam` instead of `cv2.VideoCapture`
- No `import cv2` anywhere in the runtime path

## If You Need cv2 Later
Options to fix the cv2 import hang:
1. **Use `opencv-python-headless`** (pip) instead of system `opencv`:
   ```bash
   sudo apt remove python3-opencv
   pip3 install opencv-python-headless
   ```
2. **Set display env before import:**
   ```python
   import os
   os.environ["QT_QPA_PLATFORM"] = "offscreen"
   os.environ["DISPLAY"] = ""
   import cv2
   ```
3. **Install a virtual framebuffer:**
   ```bash
   sudo apt install xvfb
   xvfb-run python3 your_script.py
   ```
