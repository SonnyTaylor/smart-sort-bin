"""
AI Smart Bin - Web Dashboard

Flask application serving the control dashboard and REST API.
Run with: uv run app.py
"""

import json
import queue
import time
import os
import shutil
import io
import zipfile
import base64
from concurrent.futures import ThreadPoolExecutor

from flask import Flask, Response, jsonify, render_template, request, send_file

import config
import database
import llm

# Allow importing from src/pi when running on the Pi
if config.PI_MODE:
    import sys
    from pathlib import Path

    sys.path.insert(0, str(Path(__file__).parent.parent))
    from pi import hardware as hw
else:
    import mock_hardware as hw

app = Flask(__name__)

# Ensure dataset directories exist
for cat in config.CATEGORIES:
    os.makedirs(os.path.join(config.DATASET_DIR, cat), exist_ok=True)

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


@app.route("/api/data/clear", methods=["POST"])
def api_clear_data():
    """Delete all sort history from the database."""
    database.clear_sort_history()
    broadcast_sse("data_cleared", {"time": time.time()})
    return jsonify({"status": "cleared"})


@app.route("/api/stats/hourly")
def api_stats_hourly():
    """Return sort counts bucketed by hour for the last 24h."""
    return jsonify(database.get_hourly_stats())


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
    return jsonify(hw.get_system_health())


# ---------------------------------------------------------------------------
# REST API - Camera / Webcam
# ---------------------------------------------------------------------------


@app.route("/api/camera")
def api_camera():
    return jsonify(hw.get_camera_frame())


@app.route("/api/camera/stream")
def api_camera_stream():
    """Stream MJPEG frames from the camera (serves cached frames from background capture)."""

    def generate():
        last_sent = None
        while True:
            frame_bytes = hw.get_camera_jpeg_bytes()
            if frame_bytes and frame_bytes != last_sent:
                # Draw face tracking overlay if active
                try:
                    ft = hw.get_hw().face_tracker
                    if ft.active and ft.face_box:
                        import cv2
                        import numpy as np
                        nparr = np.frombuffer(frame_bytes, np.uint8)
                        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                        if frame is not None:
                            x, y, w, h = ft.face_box
                            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                            cv2.putText(frame, 'FACE', (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                            _, buf = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                            frame_bytes = buf.tobytes()
                except Exception:
                    pass  # Fall through with original frame

                yield (
                    b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
                )
                last_sent = frame_bytes
            else:
                time.sleep(0.1)

    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")


@app.route("/api/face-tracking", methods=["GET"])
def api_face_tracking_status():
    """Get face tracking status."""
    ft = hw.get_hw().face_tracker
    return jsonify(ft.get_status())


@app.route("/api/face-tracking", methods=["POST"])
def api_face_tracking_toggle():
    """Toggle face tracking on/off.
    Expects JSON: {"active": true/false}
    """
    data = request.get_json(force=True)
    ft = hw.get_hw().face_tracker

    if data.get("active"):
        if ft.start():
            broadcast_sse("face_tracking", {"active": True})
            return jsonify({"status": "started", "available": ft.available})
        else:
            return jsonify({"status": "error", "message": "Face tracker not available"}), 400
    else:
        ft.stop()
        broadcast_sse("face_tracking", {"active": False})
        return jsonify({"status": "stopped"})


@app.route("/api/face-tracking/config", methods=["POST"])
def api_face_tracking_config():
    """Update face tracking parameters.
    Expects JSON: {"tracking_speed": 0.5, "deadzone": 0.04, "kp": 1.5, "ki": 0.1, "kd": 0.8}
    """
    data = request.get_json(force=True)
    ft = hw.get_hw().face_tracker

    if "tracking_speed" in data:
        ft.tracking_speed = max(0.1, min(1.0, float(data["tracking_speed"])))
    if "deadzone" in data:
        ft.deadzone = max(0.01, min(0.2, float(data["deadzone"])))
    if "kp" in data:
        kp = max(0.1, min(5.0, float(data["kp"])))
        ft._pid_pan.kp = kp
        ft._pid_tilt.kp = kp
    if "ki" in data:
        ki = max(0.0, min(2.0, float(data["ki"])))
        ft._pid_pan.ki = ki
        ft._pid_tilt.ki = ki
    if "kd" in data:
        kd = max(0.0, min(3.0, float(data["kd"])))
        ft._pid_pan.kd = kd
        ft._pid_tilt.kd = kd

    return jsonify(ft.get_status())


@app.route("/api/classify", methods=["POST"])
def api_classify():
    """
    Classify a webcam photo via the active LLM provider.
    Expects JSON: {"image": "<base64 jpeg data>"}
    OR {"source": "device"} to use internal camera
    """
    data = request.get_json(force=True)

    if data.get("source") == "device":
        # Capture from hardware (mocked here)
        raw_jpeg = hw.get_camera_jpeg_bytes()
        import base64

        image_b64 = base64.b64encode(raw_jpeg).decode("utf-8")
    else:
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

    items = result.get("items", [])

    # Log each detected item as a separate sort event
    for item in items:
        database.log_sort(
            category=item["category"],
            confidence=item["confidence"],
            mode=config.MODE_LLM,
            label=item.get("label", ""),
            duration_ms=duration_ms,
        )

    event = {
        "items": items,
        "mode": config.MODE_LLM,
        "duration_ms": duration_ms,
        "raw_response": result.get("raw_response", ""),
    }
    broadcast_sse("sort_event", event)

    # Return the full payload to the caller, including image if needed
    response_data = dict(event)
    if data.get("source") == "device":
        response_data["image"] = image_b64

    return jsonify(response_data)


# ---------------------------------------------------------------------------
# REST API - Model Comparison
# ---------------------------------------------------------------------------


@app.route("/api/compare", methods=["POST"])
def api_compare():
    """
    Classify the same image with two different providers in parallel.
    Expects JSON: {"image": "<base64 jpeg>", "provider_a": "<id>", "provider_b": "<id>"}
    """
    data = request.get_json(force=True)

    image_b64 = data.get("image", "")
    provider_a_id = data.get("provider_a", "")
    provider_b_id = data.get("provider_b", "")

    if not image_b64:
        return jsonify({"error": "No image data provided"}), 400
    if not provider_a_id or not provider_b_id:
        return jsonify({"error": "Two provider IDs are required"}), 400

    if "," in image_b64:
        image_b64 = image_b64.split(",", 1)[1]

    provider_a = database.get_provider_by_id(provider_a_id)
    provider_b = database.get_provider_by_id(provider_b_id)

    if not provider_a:
        return jsonify({"error": f"Provider not found: {provider_a_id}"}), 400
    if not provider_b:
        return jsonify({"error": f"Provider not found: {provider_b_id}"}), 400

    from llm import PROVIDER_PRESETS

    preset_a = PROVIDER_PRESETS.get(provider_a_id, PROVIDER_PRESETS["custom"])
    preset_b = PROVIDER_PRESETS.get(provider_b_id, PROVIDER_PRESETS["custom"])
    requires_key_a = bool(preset_a["auth_header"])
    requires_key_b = bool(preset_b["auth_header"])

    if requires_key_a and not provider_a["api_key"]:
        return jsonify({"error": f"No API key set for {provider_a['name']}"}), 400
    if requires_key_b and not provider_b["api_key"]:
        return jsonify({"error": f"No API key set for {provider_b['name']}"}), 400

    # Allow model ID overrides from the request
    model_a_override = data.get("model_a", "").strip()
    model_b_override = data.get("model_b", "").strip()
    if model_a_override:
        provider_a = dict(provider_a, model=model_a_override)
    if model_b_override:
        provider_b = dict(provider_b, model=model_b_override)

    explain = data.get("explain", False)

    def run_classify(provider):
        start = time.time()
        result = llm.classify_image(
            image_b64=image_b64,
            provider_id=provider["id"],
            api_key=provider["api_key"],
            model=provider["model"],
            base_url=provider["base_url"],
            explain=explain,
        )
        duration_ms = int((time.time() - start) * 1000)
        result["duration_ms"] = duration_ms
        result["provider_id"] = provider["id"]
        result["provider_name"] = provider["name"]
        result["model"] = provider["model"]
        return result

    with ThreadPoolExecutor(max_workers=2) as executor:
        future_a = executor.submit(run_classify, provider_a)
        future_b = executor.submit(run_classify, provider_b)
        result_a = future_a.result()
        result_b = future_b.result()

    return jsonify({"a": result_a, "b": result_b})


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


@app.route("/api/servos/pan", methods=["POST"])
def api_set_pan():
    data = request.get_json(force=True)
    value = data.get("value", 0)
    hw.set_pan(value)
    broadcast_sse("servo_update", {"axis": "pan", "value": value})
    return jsonify({"axis": "pan", "value": value})


@app.route("/api/servos/tilt", methods=["POST"])
def api_set_tilt():
    data = request.get_json(force=True)
    value = data.get("value", 0)
    hw.set_tilt(value)
    broadcast_sse("servo_update", {"axis": "tilt", "value": value})
    return jsonify({"axis": "tilt", "value": value})


@app.route("/api/sort", methods=["POST"])
def api_manual_sort():
    if config.MOCK_MODE:
        return jsonify(
            {"status": "mock", "message": "Mock mode - no hardware connected"}
        ), 200

    # Step 1: Capture photo
    raw_jpeg = hw.capture_photo()
    if not raw_jpeg:
        return jsonify({"error": "Camera capture failed"}), 500
    image_b64 = base64.b64encode(raw_jpeg).decode("utf-8")

    provider = database.get_active_provider()
    if not provider:
        return jsonify({"error": "No active LLM provider configured"}), 400
    if not provider["api_key"]:
        return jsonify({"error": f"No API key set for {provider['name']}"}), 400

    # Step 2: Classify (LED = blue)
    hw.set_led("blue")
    broadcast_sse("sort_stage", {"stage": "classifying"})
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
        hw.set_led("purple")
        broadcast_sse("sort_stage", {"stage": "error", "error": result["error"]})
        return jsonify(result), 502

    items = result.get("items", [])
    for item in items:
        database.log_sort(
            category=item["category"],
            confidence=item["confidence"],
            mode=config.MODE_LLM,
            label=item.get("label", ""),
            duration_ms=duration_ms,
        )

    # Step 3: Sort (pan → dump → return → home)
    if items:
        cat = items[0]["category"]
        color_map = {"general": "red", "recycling": "yellow", "compost": "green"}
        led_color = color_map.get(cat, "white")

        # Pan to bin third
        broadcast_sse("sort_stage", {"stage": "sorting", "category": cat, "action": "panning"})
        hw.set_led("yellow")
        preset = hw.CATEGORY_PRESETS.get(cat, {})
        hw.set_pan(preset.get("pan", 0))
        time.sleep(0.5)

        # Tilt to dump
        broadcast_sse("sort_stage", {"stage": "sorting", "category": cat, "action": "dumping"})
        hw.set_led(led_color)
        hw.set_tilt(preset.get("tilt_dump", -0.6))
        time.sleep(1.0)

        # Return tilt
        broadcast_sse("sort_stage", {"stage": "sorting", "category": cat, "action": "returning"})
        hw.set_tilt(preset.get("tilt_rest", 0))
        time.sleep(0.5)

        # Pan home
        hw.set_pan(0.0)
        time.sleep(0.5)

        hw.set_led(led_color)
        broadcast_sse("sort_stage", {"stage": "done", "category": cat})
    else:
        hw.set_led("white")
        broadcast_sse("sort_stage", {"stage": "done", "category": None})

    event = {
        "items": items,
        "mode": config.MODE_LLM,
        "duration_ms": duration_ms,
        "raw_response": result.get("raw_response", ""),
    }
    broadcast_sse("sort_event", event)
    return jsonify(event)


@app.route("/api/led", methods=["POST"])
def api_set_led():
    """Set the LED ring color."""
    data = request.get_json(force=True)
    color = data.get("color", "off")
    hw.set_led(color)
    broadcast_sse("led_update", {"color": color})
    return jsonify({"color": color})


@app.route("/api/home", methods=["POST"])
def api_home():
    hw.center_servos()
    hw.set_led("white")
    broadcast_sse("servo_home", {"status": "homed"})
    return jsonify({"status": "homed"})


@app.route("/pi")
def pi_dashboard():
    return render_template("pi_dashboard.html")


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
# Dataset Endpoints
# ---------------------------------------------------------------------------


@app.route("/api/dataset/save", methods=["POST"])
def api_dataset_save():
    data = request.get_json(force=True)
    image_b64 = data.get("image", "")
    category = data.get("category", "")

    if not image_b64 or not category:
        return jsonify({"error": "Missing image or category"}), 400

    if category not in config.CATEGORIES:
        return jsonify({"error": f"Invalid category: {category}"}), 400

    if "," in image_b64:
        image_b64 = image_b64.split(",", 1)[1]

    try:
        image_data = base64.b64decode(image_b64)
        filename = f"{int(time.time() * 1000)}.jpg"
        filepath = os.path.join(config.DATASET_DIR, category, filename)

        with open(filepath, "wb") as f:
            f.write(image_data)

        return jsonify({"status": "saved", "filename": filename, "category": category})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/dataset/stats", methods=["GET"])
def api_dataset_stats():
    stats = {"total": 0}
    for cat in config.CATEGORIES:
        cat_dir = os.path.join(config.DATASET_DIR, cat)
        count = (
            len([f for f in os.listdir(cat_dir) if f.endswith(".jpg")])
            if os.path.exists(cat_dir)
            else 0
        )
        stats[cat] = count
        stats["total"] += count
    return jsonify(stats)


@app.route("/api/dataset/export", methods=["GET"])
def api_dataset_export():
    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, "w", zipfile.ZIP_DEFLATED) as zf:
        for cat in config.CATEGORIES:
            cat_dir = os.path.join(config.DATASET_DIR, cat)
            if os.path.exists(cat_dir):
                for filename in os.listdir(cat_dir):
                    if filename.endswith(".jpg"):
                        filepath = os.path.join(cat_dir, filename)
                        zf.write(filepath, arcname=os.path.join(cat, filename))

    memory_file.seek(0)
    return send_file(
        memory_file,
        mimetype="application/zip",
        as_attachment=True,
        download_name="dataset.zip",
    )


@app.route("/api/dataset/clear", methods=["POST"])
def api_dataset_clear():
    for cat in config.CATEGORIES:
        cat_dir = os.path.join(config.DATASET_DIR, cat)
        if os.path.exists(cat_dir):
            for filename in os.listdir(cat_dir):
                if filename.endswith(".jpg"):
                    os.remove(os.path.join(cat_dir, filename))
    return jsonify({"status": "cleared"})


@app.route("/api/dataset/images")
def api_dataset_images():
    """List all saved dataset images."""
    images = []
    for cat in config.CATEGORIES:
        cat_dir = os.path.join(config.DATASET_DIR, cat)
        if os.path.exists(cat_dir):
            for filename in sorted(os.listdir(cat_dir), reverse=True):
                if filename.endswith(".jpg"):
                    images.append(
                        {
                            "category": cat,
                            "filename": filename,
                            "url": f"/api/dataset/image/{cat}/{filename}",
                        }
                    )
    return jsonify(images)


@app.route("/api/dataset/image/<category>/<filename>")
def api_dataset_image(category, filename):
    """Serve a single dataset image. Validates inputs to prevent path traversal."""
    if category not in config.CATEGORIES:
        return jsonify({"error": "Invalid category"}), 400
    if "/" in filename or "\\" in filename or ".." in filename:
        return jsonify({"error": "Invalid filename"}), 400
    filepath = os.path.join(config.DATASET_DIR, category, filename)
    if not os.path.isfile(filepath):
        return jsonify({"error": "Not found"}), 404
    return send_file(filepath, mimetype="image/jpeg")


@app.route("/api/providers/<provider_id>/test", methods=["POST"])
def api_test_provider(provider_id):
    """Test an LLM provider connection with a minimal text-only request."""
    providers = database.get_providers()
    provider = next((p for p in providers if p["id"] == provider_id), None)
    if not provider:
        return jsonify({"error": f"Unknown provider: {provider_id}"}), 404

    from llm import PROVIDER_PRESETS
    import httpx

    preset = PROVIDER_PRESETS.get(provider_id, PROVIDER_PRESETS["custom"])
    requires_key = bool(preset["auth_header"])

    if requires_key and not provider["api_key"]:
        return jsonify({"error": "No API key configured"}), 400

    url = provider["base_url"] or preset["base_url"]
    if not url:
        return jsonify({"error": "No API URL configured"}), 400

    headers = {"Content-Type": "application/json"}
    if requires_key and provider["api_key"]:
        headers[preset["auth_header"]] = f"{preset['auth_prefix']}{provider['api_key']}"

    payload = {
        "model": provider["model"],
        "messages": [{"role": "user", "content": "Respond with only the word OK."}],
        "max_tokens": 5,
        "temperature": 0,
    }

    # Local models may need longer to cold-start
    test_timeout = 30.0 if provider_id == "ollama" else 10.0

    try:
        with httpx.Client(timeout=test_timeout) as client:
            resp = client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
        return jsonify({"status": "ok", "message": "Connection successful"})
    except httpx.HTTPStatusError as e:
        return jsonify(
            {"error": f"HTTP {e.response.status_code}: {e.response.text[:200]}"}
        ), 502
    except httpx.ConnectError:
        if provider_id == "ollama":
            return jsonify(
                {
                    "error": "Cannot connect to Ollama. Is it running? Check that Ollama is started and listening on the configured URL."
                }
            ), 502
        return jsonify({"error": "Connection refused. Check the API URL."}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 502


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
    import logging
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

    database.init_db()

    if config.MOCK_MODE:
        print("[mock] Running in mock mode (no hardware)")

    print(f"[dashboard] http://0.0.0.0:{config.PORT}")
    app.run(host=config.HOST, port=config.PORT, debug=False, threaded=True)


if __name__ == "__main__":
    main()
