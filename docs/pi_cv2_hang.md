# Pi 3B — cv2 Import Hang Issue (FIXED)

## Status: FIXED ✅

**Solution:** Install `opencv-python-headless` from pip instead of the apt version.

```bash
sudo apt-get remove -y python3-opencv
pip install opencv-python-headless --break-system-packages
```

This gives you cv2 4.13.0 which imports fine on headless Pi 3B. No workarounds needed.

---

## Original Problem (for reference)

`import cv2` (OpenCV) **deadlocks the entire Python process** on the Pi 3B when using the system-installed `opencv` package (v4.10.0 via `python3-opencv` apt package).

### Symptoms
- Flask starts but produces no output, no log, doesn't bind to port
- `python3 -c "import cv2"` hangs forever
- CPU spikes to 100% on the python process
- `ps aux` shows python in `R` state but never progresses

### Root Cause
The system `opencv` package at `/usr/lib/python3/dist-packages/cv2.cpython-313-aarch64-linux-gnu.so` tries to initialize GTK/Qt display backends on import, which hangs when there's no display server running (headless Pi).

### Affected
- **Package:** `opencv` 4.10.0 (apt `python3-opencv`)
- **Python:** 3.13.5 (aarch64)
- **OS:** Debian 13 (trixie), kernel 6.12.75+rpt-rpi-v8
- **Device:** Raspberry Pi 3B, headless (no display)

### Why pip headless works
`opencv-python-headless` is built without GUI/Qt/GTK backends. It doesn't try to initialize display subsystems on import, so it works fine on headless systems.
