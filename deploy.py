#!/usr/bin/env python3
"""
deploy.py — Push code to the Pi 3B and restart Flask

Usage:
  python deploy.py              # Full deploy (upload + restart)
  python deploy.py --upload     # Upload only
  python deploy.py --restart    # Restart only
  python deploy.py --status     # Check if Flask is running
  python deploy.py --logs       # Show Flask logs
"""

import sys
import os
import time
import argparse

try:
    import paramiko
except ImportError:
    print("paramiko not installed. Run: pip install paramiko")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
PI_HOST = "192.168.0.88"
PI_USER = "pi"
PI_PASS = "Futiz$23"
PI_DIR = "/home/pi/smartbin"

# Files to sync (relative to project root)
FILES = [
    # Core Python
    "src/pi/hardware.py",
    "src/web/app.py",
    "src/web/binjamin.py",
    "src/web/config.py",
    "src/web/database.py",
    "src/web/llm.py",
    # New dashboard v2 templates
    "src/web/templates/pi/base.html",
    "src/web/templates/pi/dashboard.html",
    "src/web/templates/pi/binjamin.html",
    "src/web/templates/pi/partials/header.html",
    "src/web/templates/pi/partials/camera_zone.html",
    "src/web/templates/pi/partials/system_panel.html",
    "src/web/templates/pi/partials/control_panel.html",
    "src/web/templates/pi/partials/activity_panel.html",
    "src/web/templates/pi/partials/settings_drawer.html",
    "src/web/templates/pi/partials/chat_drawer.html",
    # Legacy dashboard (still needed)
    "src/web/templates/pi_dashboard.html",
    # New dashboard v2 CSS
    "src/web/static/css/pi-dashboard.css",
    # New dashboard v2 JS modules
    "src/web/static/js/pi/api.js",
    "src/web/static/js/pi/state.js",
    "src/web/static/js/pi/ui.js",
    "src/web/static/js/pi/sse.js",
    "src/web/static/js/pi/camera.js",
    "src/web/static/js/pi/servos.js",
    "src/web/static/js/pi/input-keyboard.js",
    "src/web/static/js/pi/input-gamepad.js",
    "src/web/static/js/pi/led.js",
    "src/web/static/js/pi/activity.js",
    "src/web/static/js/pi/settings.js",
    "src/web/static/js/pi/fun-controls.js",
    "src/web/static/js/pi/dashboard.js",
    "src/web/static/js/pi/binjamin.js",
]

# Colors
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BLUE = "\033[94m"
RESET = "\033[0m"


def log(msg): print(f"{BLUE}[deploy]{RESET} {msg}")
def ok(msg):  print(f"{GREEN}[ok]{RESET} {msg}")
def warn(msg): print(f"{YELLOW}[warn]{RESET} {msg}")
def err(msg): print(f"{RED}[error]{RESET} {msg}")


def connect():
    """Connect to the Pi via SSH."""
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(PI_HOST, username=PI_USER, password=PI_PASS, timeout=5)
    return client


def ssh_exec(client, cmd, timeout=10, background=False):
    """Execute a command and return stdout."""
    if background:
        # For background commands, use transport directly to avoid blocking
        transport = client.get_transport()
        chan = transport.open_session()
        chan.settimeout(timeout)
        chan.exec_command(cmd)
        time.sleep(1)
        chan.close()
        return ""
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    return stdout.read().decode("utf-8", errors="replace").strip()


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------
def cmd_status(client):
    """Check Flask status on the Pi."""
    log(f"Checking Pi status at {PI_HOST}...")

    # Flask process
    proc = ssh_exec(client, "ps aux | grep 'python3.*app.py' | grep -v grep | head -1")
    if proc:
        ok("Flask is running")
        print(f"  {proc[:120]}")
    else:
        warn("Flask is NOT running")

    # Port check
    port = ssh_exec(client, "ss -tlnp | grep 8080")
    if port:
        ok("Port 8080 is listening")
    else:
        warn("Port 8080 not listening")

    # HTTP check
    http = ssh_exec(client, "curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/pi")
    if http == "200":
        ok(f"Dashboard responds: HTTP {http}")
        print(f"  -> http://{PI_HOST}:8080/pi")
    else:
        warn(f"Dashboard HTTP: {http or 'timeout'}")

    # Health
    health = ssh_exec(client, "curl -s http://localhost:8080/api/health 2>/dev/null")
    if health:
        import json
        try:
            h = json.loads(health)
            ok(f"CPU temp: {h.get('cpu_temp_c', '?')}°C")
            print(f"  Uptime: {h.get('uptime_seconds', 0):.0f}s")
            print(f"  Servos (pigpio): {'connected' if h.get('uart_connected') else 'disconnected'}")
        except json.JSONDecodeError:
            pass

    # Systemd
    svc = ssh_exec(client, "systemctl is-active smartbin.service 2>/dev/null")
    if svc == "active":
        ok("systemd: smartbin.service is active")
    else:
        warn(f"systemd: smartbin.service is {svc or 'not found'} (using nohup)")


def cmd_upload(client):
    """Upload files to the Pi."""
    log("Uploading files to Pi...")

    project_root = os.path.dirname(os.path.abspath(__file__))
    sftp = client.open_sftp()
    uploaded = 0

    for file in FILES:
        local_path = os.path.join(project_root, file)
        remote_path = f"{PI_DIR}/{file}"

        if not os.path.exists(local_path):
            warn(f"Skip (not found): {file}")
            continue

        # Create remote directory
        remote_dir = os.path.dirname(remote_path)
        try:
            sftp.stat(remote_dir)
        except FileNotFoundError:
            ssh_exec(client, f"mkdir -p {remote_dir}")

        sftp.put(local_path, remote_path)
        ok(file)
        uploaded += 1

    sftp.close()
    log(f"Uploaded {uploaded} files")


def cmd_restart(client):
    """Restart Flask on the Pi."""
    log("Restarting Flask on Pi...")

    # Try systemd first
    svc = ssh_exec(client, "systemctl is-active smartbin.service 2>/dev/null")
    if svc == "active":
        ssh_exec(client, "sudo systemctl restart smartbin.service")
        ok("Restarted via systemd")
        time.sleep(2)
        cmd_status(client)
        return

    # Fallback: nohup
    log("Using nohup fallback...")

    # Kill existing
    ssh_exec(client, "pkill -9 -f 'python3.*app.py' 2>/dev/null || true")
    time.sleep(1)

    # Start fresh (background to avoid blocking)
    ssh_exec(client, f"cd {PI_DIR}/src/web && nohup python3 -u app.py > /tmp/flask.log 2>&1 &", background=True)
    time.sleep(5)

    # Verify
    port = ssh_exec(client, "ss -tlnp | grep 8080")
    if port:
        ok("Flask started on port 8080")
        print(f"  -> http://{PI_HOST}:8080/pi")
    else:
        err("Flask failed to start!")
        log_content = ssh_exec(client, "cat /tmp/flask.log 2>/dev/null")
        if log_content:
            print(log_content[:500])


def cmd_logs(client):
    """Show Flask logs."""
    log("Recent Flask logs:")
    logs = ssh_exec(client, "tail -30 /tmp/flask.log 2>/dev/null")
    if logs:
        print(logs)
    else:
        warn("No log file found")


def cmd_setup_services(client):
    """Install systemd services for auto-start."""
    log("Setting up systemd services...")

    smartbin_service = """[Unit]
Description=Smart Bin Flask Dashboard
After=network.target pigpiod.service

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/smartbin/src/web
ExecStartPre=/bin/rm -rf /home/pi/smartbin/src/web/__pycache__
ExecStart=/usr/bin/python3 -u app.py
Restart=on-failure
RestartSec=3
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
"""

    pigpiod_service = """[Unit]
Description=pigpio Daemon
After=network.target

[Service]
Type=forking
ExecStart=/usr/bin/pigpiod
ExecStop=/bin/kill -INT $MAINPID
Restart=on-failure

[Install]
WantedBy=multi-user.target
"""

    sftp = client.open_sftp()

    with sftp.open("/tmp/smartbin.service", "w") as f:
        f.write(smartbin_service)
    with sftp.open("/tmp/pigpiod.service", "w") as f:
        f.write(pigpiod_service)

    sftp.close()

    # Install with sudo
    cmds = [
        f"echo {PI_PASS} | sudo -S cp /tmp/smartbin.service /etc/systemd/system/",
        f"echo {PI_PASS} | sudo -S cp /tmp/pigpiod.service /etc/systemd/system/",
        f"echo {PI_PASS} | sudo -S systemctl daemon-reload",
        f"echo {PI_PASS} | sudo -S systemctl enable pigpiod.service smartbin.service",
        f"echo {PI_PASS} | sudo -S systemctl start pigpiod.service",
    ]
    for cmd in cmds:
        ssh_exec(client, cmd, timeout=5)
        time.sleep(0.5)

    ok("Services installed and enabled")
    warn("Run 'sudo systemctl start smartbin' on Pi to start with systemd")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Deploy smart-sort-bin to Pi 3B")
    parser.add_argument("--upload", "-u", action="store_true", help="Upload files only")
    parser.add_argument("--restart", "-r", action="store_true", help="Restart Flask only")
    parser.add_argument("--status", "-s", action="store_true", help="Check Flask status")
    parser.add_argument("--logs", "-l", action="store_true", help="Show Flask logs")
    parser.add_argument("--setup", action="store_true", help="Install systemd services")
    args = parser.parse_args()

    try:
        client = connect()
    except Exception as e:
        err(f"Cannot connect to Pi at {PI_HOST}: {e}")
        sys.exit(1)

    try:
        if args.status:
            cmd_status(client)
        elif args.upload:
            cmd_upload(client)
        elif args.restart:
            cmd_restart(client)
        elif args.logs:
            cmd_logs(client)
        elif args.setup:
            cmd_setup_services(client)
        else:
            # Default: upload + restart
            cmd_upload(client)
            print()
            cmd_restart(client)
    finally:
        client.close()


if __name__ == "__main__":
    main()
