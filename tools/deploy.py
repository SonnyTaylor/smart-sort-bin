#!/usr/bin/env python3
"""
Push code to the Pi 3B and restart Flask.

Run from anywhere; paths are worked out relative to this file.

  python tools/deploy.py              # Full deploy (upload + restart)
  python tools/deploy.py --upload     # Upload only
  python tools/deploy.py --restart    # Restart only
  python tools/deploy.py --status     # Check if Flask is running
  python tools/deploy.py --logs       # Show Flask logs
  python tools/deploy.py --setup      # Install systemd services

Connection details come from the environment: PI_HOST, PI_USER, PI_PASS.
If PI_PASS is unset you are prompted for it. Nothing is stored in the repo.
"""

import sys
import os
import time
import getpass
import argparse

try:
    import paramiko
except ImportError:
    print("paramiko not installed. Run: pip install paramiko")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
# Host/user default to the LAN prototype but can be overridden via env.
# The password is never hardcoded: set PI_PASS in the environment, or you'll
# be prompted for it on first use.
PI_HOST = os.environ.get("PI_HOST", "192.168.0.88")
PI_USER = os.environ.get("PI_USER", "pi")
PI_DIR = os.environ.get("PI_DIR", "/home/pi/smartbin")

_PI_PASS = os.environ.get("PI_PASS")


def pi_pass():
    """Return the Pi SSH/sudo password, prompting once if not set via env."""
    global _PI_PASS
    if not _PI_PASS:
        _PI_PASS = getpass.getpass(f"Password for {PI_USER}@{PI_HOST}: ")
    return _PI_PASS

# Directories to sync (relative to project root). Every file inside is
# uploaded, so new modules/templates deploy without touching this list.
SYNC_DIRS = [
    "src/pi",
    "src/web",
]

# Skip these anywhere in a synced tree
SKIP_DIRS = {".venv", "__pycache__", ".pytest_cache", "node_modules", "dataset"}
SKIP_SUFFIXES = {".db", ".db-wal", ".db-shm", ".pyc", ".log"}


def collect_files(project_root):
    """Walk SYNC_DIRS and return project-relative paths to upload."""
    files = []
    for base in SYNC_DIRS:
        base_path = os.path.join(project_root, base)
        if not os.path.isdir(base_path):
            continue
        for root, dirs, names in os.walk(base_path):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
            for name in names:
                if any(name.endswith(s) for s in SKIP_SUFFIXES):
                    continue
                full = os.path.join(root, name)
                rel = os.path.relpath(full, project_root).replace(os.sep, "/")
                files.append(rel)
    return files

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
    client.connect(PI_HOST, username=PI_USER, password=pi_pass(), timeout=5)
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

    # This script lives in tools/, so the project root is one level up.
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    files = collect_files(project_root)
    sftp = client.open_sftp()
    uploaded = 0
    known_dirs = set()

    for file in files:
        local_path = os.path.join(project_root, file)
        remote_path = f"{PI_DIR}/{file}"

        # Create remote directory (cache checks to avoid a stat per file)
        remote_dir = os.path.dirname(remote_path)
        if remote_dir not in known_dirs:
            try:
                sftp.stat(remote_dir)
            except FileNotFoundError:
                ssh_exec(client, f"mkdir -p {remote_dir}")
            known_dirs.add(remote_dir)

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
ExecStart=/usr/bin/python3 -u app.py --pi
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
    pw = pi_pass()
    cmds = [
        f"echo {pw} | sudo -S cp /tmp/smartbin.service /etc/systemd/system/",
        f"echo {pw} | sudo -S cp /tmp/pigpiod.service /etc/systemd/system/",
        f"echo {pw} | sudo -S systemctl daemon-reload",
        f"echo {pw} | sudo -S systemctl enable pigpiod.service smartbin.service",
        f"echo {pw} | sudo -S systemctl start pigpiod.service",
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
