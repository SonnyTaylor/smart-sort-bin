"""
AI Smart Bin - Web Dashboard

Flask application serving the control dashboard and REST API.
Run with: uv run app.py
"""

import json
import queue
import time

from flask import Flask, Response, jsonify, render_template, request

import config
import database
import llm
import mock_hardware

app = Flask(__name__)

# ---------------------------------------------------------------------------
# SSE (Server-Sent Events) infrastructure
# ---------------------------------------------------------------------------

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
    return render_template("dashboard.html")


# ---------------------------------------------------------------------------
# REST API - Statistics
# ---------------------------------------------------------------------------


@app.route("/api/stats")
def api_stats():
    return jsonify(database.get_stats())


@app.route("/api/history")
def api_history():
    limit = request.args.get("limit", 50, type=int)
    return jsonify(database.get_recent_sorts(limit))


# ---------------------------------------------------------------------------
# REST API - Mode
# ---------------------------------------------------------------------------


@app.route("/api/mode", methods=["GET"])
def api_get_mode():
    return jsonify({"mode": database.get_mode()})


@app.route("/api/mode", methods=["POST"])
def api_set_mode():
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
    return jsonify(mock_hardware.get_system_health())


# ---------------------------------------------------------------------------
# REST API - Camera / Webcam
# ---------------------------------------------------------------------------


@app.route("/api/camera")
def api_camera():
    return jsonify(mock_hardware.get_camera_frame())


@app.route("/api/classify", methods=["POST"])
def api_classify():
    """
    Classify a webcam photo via the active LLM provider.
    Expects JSON: {"image": "<base64 jpeg data>"}
    """
    data = request.get_json(force=True)
    image_b64 = data.get("image", "")

    if not image_b64:
        return jsonify({"error": "No image data provided"}), 400

    # Strip data URI prefix if present
    if "," in image_b64:
        image_b64 = image_b64.split(",", 1)[1]

    provider = database.get_active_provider()
    if not provider:
        return jsonify({"error": "No active LLM provider configured"}), 400
    if not provider["api_key"]:
        return jsonify({"error": f"No API key set for {provider['name']}"}), 400

    start_ms = time.time()
    result = llm.classify_image(
        image_b64=image_b64,
        provider_id=provider["id"],
        api_key=provider["api_key"],
        model=provider["model"],
        base_url=provider["base_url"],
    )
    duration_ms = int((time.time() - start_ms) * 1000)

    if result.get("error"):
        return jsonify(result), 502

    # Log the sort event
    database.log_sort(
        category=result["category"],
        confidence=result["confidence"],
        mode=config.MODE_LLM,
        label=result.get("label", ""),
        duration_ms=duration_ms,
    )

    event = {
        "category": result["category"],
        "confidence": result["confidence"],
        "mode": config.MODE_LLM,
        "label": result.get("label", ""),
        "duration_ms": duration_ms,
        "raw_response": result.get("raw_response", ""),
    }
    broadcast_sse("sort_event", event)
    return jsonify(event)


# ---------------------------------------------------------------------------
# REST API - Servo Controls
# ---------------------------------------------------------------------------


@app.route("/api/servos", methods=["GET"])
def api_get_servos():
    return jsonify(database.get_servo_angles())


@app.route("/api/servos", methods=["POST"])
def api_set_servo():
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
    if config.MOCK_MODE:
        return jsonify(
            {"status": "mock", "message": "Mock mode - no hardware connected"}
        ), 200
    return jsonify({"error": "Manual sort not implemented for real hardware yet"}), 501


@app.route("/api/home", methods=["POST"])
def api_home():
    broadcast_sse("servo_home", {"status": "homed"})
    return jsonify({"status": "homed"})


# ---------------------------------------------------------------------------
# REST API - LLM Provider Settings
# ---------------------------------------------------------------------------


@app.route("/api/providers", methods=["GET"])
def api_get_providers():
    """Return all configured providers (API keys masked)."""
    providers = database.get_providers()
    for p in providers:
        # Don't send full API key to frontend
        del p["api_key"]
    return jsonify(providers)


@app.route("/api/providers/<provider_id>", methods=["PATCH"])
def api_update_provider(provider_id):
    """Update a provider's settings."""
    data = request.get_json(force=True)
    try:
        database.update_provider(
            provider_id,
            api_key=data.get("api_key"),
            model=data.get("model"),
            base_url=data.get("base_url"),
            is_active=data.get("is_active"),
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    broadcast_sse("provider_update", {"provider_id": provider_id})
    return jsonify({"status": "updated", "provider_id": provider_id})


# ---------------------------------------------------------------------------
# SSE Endpoint
# ---------------------------------------------------------------------------


@app.route("/api/events")
def api_events():
    q = queue.Queue(maxsize=64)
    _sse_clients.append(q)

    def stream():
        try:
            yield f"event: connected\ndata: {json.dumps({'time': time.time()})}\n\n"
            while True:
                try:
                    message = q.get(timeout=15)
                    yield message
                except queue.Empty:
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
# Entry point
# ---------------------------------------------------------------------------


def main():
    database.init_db()

    if config.MOCK_MODE:
        print("[mock] Running in mock mode (no hardware)")

    print(f"[dashboard] http://localhost:{config.PORT}")
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG, threaded=True)


if __name__ == "__main__":
    main()
