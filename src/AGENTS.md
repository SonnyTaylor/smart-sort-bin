# The code

Everything that runs on the bin. One Flask process on a Raspberry Pi 3B serves
the dashboard, drives the servos and calls the vision model.

| File | What it does |
| :--- | :--- |
| `src/web/app.py` | Flask app: pages, REST API, server-sent events |
| `src/web/animations.py` | Keyframe playback engine, runs server-side |
| `src/web/database.py` | SQLite: sort history, calibration, sequences, providers |
| `src/web/llm.py` | Vision model providers and the waste-sorting prompt |
| `src/web/config.py` | Settings |
| `src/web/mock_hardware.py` | Stand-in hardware so it runs on a laptop |
| `src/pi/hardware.py` | The real thing: pigpio servos, v4l2 camera, LED ring |
| `src/systemd/` | Service files, installed by the deploy script's `--setup` |
| `src/esp32/` | **Dead.** Firmware from the abandoned two-board design, kept because the PowerPoint refers to that iteration. Do not extend it |

## Running it

On a laptop, no hardware needed:

```
cd src/web
uv run app.py --mock
```

On the Pi, push and restart with `python tools/deploy.py`. The full flag list,
the wiring, the OS setup and the troubleshooting are in
[`docs/pi_setup.md`](../docs/pi_setup.md).

## Three things that are not obvious

**Servos are driven by target, not position.** `set_pan` and `set_tilt` set a
target; a 50Hz thread slews the actual pulse width toward it, which is what
makes manual control smooth. The animation engine bypasses the slew with
`immediate=True`, because it generates its own eased steps and would otherwise
be smoothed twice.

**Animations play on the server**, not in the browser, so they stay smooth and
survive the page being closed. Manual servo input or a sort interrupts playback.

**Calibration lives in the database**, under the `calibration` key in
`system_state`, and is edited from the dashboard's Calibration tab. The presets
in `hardware.py` are fallbacks only. Do not treat them as the real bin
positions.

## SSH to the Pi

Use **paramiko**, not the `ssh` command. Interactive `ssh` hangs waiting for a
password that nothing can type. For `sudo`, open a PTY and write the password to
it.

Connection details come from the environment, never from the repo:

```
PI_HOST, PI_USER, PI_PASS
```

If `PI_PASS` is unset the deploy script prompts for it. Do not commit
credentials, and do not hardcode the Pi's address.

## Before you say it works

The Pi is often unplugged. If you changed anything touching real hardware and
have not run it on the Pi, say so plainly rather than implying it was tested.
`--mock` proves the code path, not the wiring.
