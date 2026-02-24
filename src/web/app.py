"""
AI Smart Bin - Web Dashboard

Flask application serving the control dashboard and REST API.
Run with: python app.py
"""

import json
import queue
import time

from flask import Flask, Response, jsonify, render_template, request

import config
import database
import mock_hardware

app = Flask(__name__)

# ---------------------------------------------------------------------------
# SSE (Server-Sent Events) infrastructure
# ---------------------------------------------------------------------------

# Connected SSE clients receive sort events and health updates in real time
_sse_clients: list[queue.Queue] = []


def broadcast_sse(event_type, data):
    """Push an event to all connected SSE clients."""
    message = f"event: {event_type}\ndata: {json.dumps(data)}\n\n"
    dead = []
    for q in _sse_clients:
        try:
            q.put_nowait(message)
        except queue.Full:
            dead.append(q)
    for q in dead:
        _sse_clients.remove(q)


# ---------------------------------------------------------------------------
# Pages
# ---------------------------------------------------------------------------


@app.route("/")
def index():
    """Serve the main dashboard page."""
    return render_template("dashboard.html")


# ---------------------------------------------------------------------------
# REST API - Statistics
# ---------------------------------------------------------------------------


@app.route("/api/stats")
def api_stats():
    """Return aggregate sorting statistics."""
    return jsonify(database.get_stats())


@app.route("/api/history")
def api_history():
    """Return recent sort events."""
    limit = request.args.get("limit", 50, type=int)
    return jsonify(database.get_recent_sorts(limit))


# ---------------------------------------------------------------------------
# REST API - Mode
# ---------------------------------------------------------------------------


@app.route("/api/mode", methods=["GET"])
def api_get_mode():
    """Return the current classification mode."""
    return jsonify({"mode": database.get_mode()})


@app.route("/api/mode", methods=["POST"])
def api_set_mode():
    """Switch classification mode (yolo / llm)."""
    data = request.get_json(force=True)
    mode = data.get("mode", "")
    try:
        database.set_mode(mode)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    broadcast_sse("mode_change", {"mode": mode})
    return jsonify({"mode": mode})


# ---------------------------------------------------------------------------
# REST API - System Health
# ---------------------------------------------------------------------------


@app.route("/api/health")
def api_health():
    """Return system health metrics."""
    return jsonify(mock_hardware.get_system_health())


# ---------------------------------------------------------------------------
# REST API - Camera
# ---------------------------------------------------------------------------


@app.route("/api/camera")
def api_camera():
    """Return camera status / last frame metadata."""
    return jsonify(mock_hardware.get_camera_frame())


# ---------------------------------------------------------------------------
# REST API - Servo Controls
# ---------------------------------------------------------------------------


@app.route("/api/servos", methods=["GET"])
def api_get_servos():
    """Return current servo angle configuration."""
    return jsonify(database.get_servo_angles())


@app.route("/api/servos", methods=["POST"])
def api_set_servo():
    """Update a servo angle for a category."""
    data = request.get_json(force=True)
    category = data.get("category", "")
    angle = data.get("angle", 0)
    try:
        database.set_servo_angle(category, angle)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    broadcast_sse("servo_update", {"category": category, "angle": angle})
    return jsonify({"category": category, "angle": angle})


@app.route("/api/sort", methods=["POST"])
def api_manual_sort():
    """Trigger a manual sort (mock mode simulates it)."""
    if config.MOCK_MODE:
        event = mock_hardware.simulate_sort()
        broadcast_sse("sort_event", event)
        return jsonify(event)
    return jsonify({"error": "Manual sort not implemented for real hardware yet"}), 501


@app.route("/api/home", methods=["POST"])
def api_home():
    """Send servos to home position."""
    broadcast_sse("servo_home", {"status": "homed"})
    return jsonify({"status": "homed"})


# ---------------------------------------------------------------------------
# SSE Endpoint
# ---------------------------------------------------------------------------


@app.route("/api/events")
def api_events():
    """SSE stream for real-time dashboard updates."""
    q = queue.Queue(maxsize=64)
    _sse_clients.append(q)

    def stream():
        try:
            # Send initial connection confirmation
            yield f"event: connected\ndata: {json.dumps({'time': time.time()})}\n\n"
            while True:
                try:
                    message = q.get(timeout=15)
                    yield message
                except queue.Empty:
                    # Send keepalive comment to prevent timeout
                    yield ": keepalive\n\n"
        except GeneratorExit:
            pass
        finally:
            if q in _sse_clients:
                _sse_clients.remove(q)

    return Response(
        stream(),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ---------------------------------------------------------------------------
# Mock sensor loop callback
# ---------------------------------------------------------------------------


def _on_mock_sort(event):
    """Called by the mock sensor loop when a simulated sort happens."""
    broadcast_sse("sort_event", event)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    database.init_db()

    if config.MOCK_MODE:
        print("[mock] Starting simulated sensor loop...")
        sensor_loop = mock_hardware.MockSensorLoop(on_sort_callback=_on_mock_sort)
        sensor_loop.start()

    print(f"[dashboard] Starting on http://localhost:{config.PORT}")
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG, threaded=True)
