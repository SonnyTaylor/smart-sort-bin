#!/usr/bin/env bash
#
# deploy.sh — Push code to the Pi 3B and restart Flask
#
# Usage:
#   ./deploy.sh              # Full deploy (upload + restart)
#   ./deploy.sh --upload     # Upload only, don't restart
#   ./deploy.sh --restart    # Restart only, don't upload
#   ./deploy.sh --status     # Check if Flask is running
#
# Requires: ssh, scp (standard on macOS/Linux/WSL)
# Pi must be reachable at 192.168.0.88

set -euo pipefail

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
PI_HOST="192.168.0.88"
PI_USER="pi"
PI_PASS='Futiz$23'
PI_DIR="/home/pi/smartbin"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"

# Files to sync (relative to project root)
FILES=(
  "src/pi/hardware.py"
  "src/web/app.py"
  "src/web/config.py"
  "src/web/database.py"
  "src/web/llm.py"
  "src/web/templates/pi_dashboard.html"
)

# Directories to sync (full mirror)
DIRS=(
  "src/web/templates"
)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
ssh_cmd() {
  sshpass -p "$PI_PASS" ssh -o StrictHostKeyChecking=no "$PI_USER@$PI_HOST" "$@"
}

scp_file() {
  sshpass -p "$PI_PASS" scp -o StrictHostKeyChecking=no "$1" "$PI_USER@$PI_HOST:$2"
}

log() { echo -e "${BLUE}[deploy]${NC} $1"; }
ok()  { echo -e "${GREEN}[ok]${NC} $1"; }
err() { echo -e "${RED}[error]${NC} $1"; }
warn(){ echo -e "${YELLOW}[warn]${NC} $1"; }

# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------
cmd_status() {
  log "Checking Pi status at $PI_HOST..."

  # Flask process
  local proc
  proc=$(ssh_cmd "ps aux | grep 'python3.*app.py' | grep -v grep | head -1" 2>/dev/null || true)
  if [ -n "$proc" ]; then
    ok "Flask is running"
    echo "  $proc" | head -c 120
    echo
  else
    warn "Flask is NOT running"
  fi

  # Port check
  local port
  port=$(ssh_cmd "ss -tlnp | grep 8080" 2>/dev/null || true)
  if [ -n "$port" ]; then
    ok "Port 8080 is listening"
  else
    warn "Port 8080 not listening"
  fi

  # HTTP check
  local http
  http=$(ssh_cmd "curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/pi" 2>/dev/null || true)
  if [ "$http" = "200" ]; then
    ok "Dashboard responds: HTTP $http"
    echo "  → http://$PI_HOST:8080/pi"
  else
    warn "Dashboard HTTP: ${http:-timeout}"
  fi

  # Health
  local health
  health=$(ssh_cmd "curl -s http://localhost:8080/api/health 2>/dev/null" || true)
  if [ -n "$health" ]; then
    local temp
    temp=$(echo "$health" | grep -o '"cpu_temp_c":[0-9.]*' | cut -d: -f2)
    ok "CPU temp: ${temp}°C"
  fi

  # Systemd
  local svc
  svc=$(ssh_cmd "systemctl is-active smartbin.service 2>/dev/null" || true)
  if [ "$svc" = "active" ]; then
    ok "systemd: smartbin.service is active"
  else
    warn "systemd: smartbin.service is $svc (using nohup fallback)"
  fi
}

cmd_upload() {
  log "Uploading files to $PI_HOST..."

  local uploaded=0
  for file in "${FILES[@]}"; do
    local local_path="$LOCAL_DIR/$file"
    local remote_path="$PI_DIR/$file"

    if [ ! -f "$local_path" ]; then
      warn "Skip (not found): $file"
      continue
    fi

    # Create remote directory if needed
    ssh_cmd "mkdir -p \"$(dirname "$remote_path")\"" 2>/dev/null || true

    scp_file "$local_path" "$remote_path"
    ok "$file"
    ((uploaded++))
  done

  log "Uploaded $uploaded files"
}

cmd_restart() {
  log "Restarting Flask on Pi..."

  # Try systemd first
  local svc
  svc=$(ssh_cmd "systemctl is-active smartbin.service 2>/dev/null" || true)
  if [ "$svc" = "active" ]; then
    ssh_cmd "sudo systemctl restart smartbin.service" 2>/dev/null
    ok "Restarted via systemd"
    sleep 2
    cmd_status
    return
  fi

  # Fallback: kill existing and start via nohup
  log "Using nohup fallback..."

  # Kill existing process
  ssh_cmd "pkill -9 -f 'python3.*app.py' 2>/dev/null || true"
  sleep 1

  # Start fresh
  ssh_cmd "cd $PI_DIR/src/web && nohup python3 -u app.py > /tmp/flask.log 2>&1 &"
  sleep 3

  # Verify
  local port
  port=$(ssh_cmd "ss -tlnp | grep 8080" 2>/dev/null || true)
  if [ -n "$port" ]; then
    ok "Flask started on port 8080"
    echo "  → http://$PI_HOST:8080/pi"
  else
    err "Flask failed to start. Check: ssh $PI_USER@$PI_HOST 'cat /tmp/flask.log'"
  fi

  # Show recent log
  local log_content
  log_content=$(ssh_cmd "tail -5 /tmp/flask.log 2>/dev/null" || true)
  if [ -n "$log_content" ]; then
    echo "$log_content"
  fi
}

cmd_logs() {
  log "Recent Flask logs:"
  ssh_cmd "tail -20 /tmp/flask.log 2>/dev/null" || warn "No log file"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
# Check sshpass is available
if ! command -v sshpass &>/dev/null; then
  err "sshpass not found. Install it:"
  echo "  brew install hudochenkov/sshpass/sshpass   # macOS"
  echo "  sudo apt install sshpass                   # Linux"
  exit 1
fi

case "${1:-}" in
  --upload|-u)
    cmd_upload
    ;;
  --restart|-r)
    cmd_restart
    ;;
  --status|-s)
    cmd_status
    ;;
  --logs|-l)
    cmd_logs
    ;;
  --help|-h)
    echo "Usage: $0 [--upload|--restart|--status|--logs]"
    echo "  (no args)   Upload + restart"
    echo "  --upload    Upload files only"
    echo "  --restart   Restart Flask only"
    echo "  --status    Check if Flask is running"
    echo "  --logs      Show recent Flask logs"
    ;;
  *)
    cmd_upload
    echo
    cmd_restart
    ;;
esac
