"""
AI Smart Bin - SQLite Database Layer

Handles sorting history, statistics, system state, servo calibration,
custom animation sequences, and LLM provider settings.
"""

import json
import sqlite3
import time
from contextlib import contextmanager

import config


@contextmanager
def get_db():
    """Context manager for database connections."""
    conn = sqlite3.connect(config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    """Create tables if they don't exist."""
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS sort_events (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp   REAL    NOT NULL,
                category    TEXT    NOT NULL,
                confidence  REAL    NOT NULL,
                mode        TEXT    NOT NULL,
                label       TEXT    DEFAULT '',
                duration_ms INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS system_state (
                key   TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS llm_providers (
                id         TEXT PRIMARY KEY,
                name       TEXT NOT NULL,
                api_key    TEXT DEFAULT '',
                base_url   TEXT DEFAULT '',
                model      TEXT DEFAULT '',
                is_active  INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS sequences (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                name       TEXT NOT NULL UNIQUE,
                keyframes  TEXT NOT NULL,
                loop       INTEGER DEFAULT 0,
                created_at REAL NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_sort_timestamp
                ON sort_events(timestamp);

            CREATE INDEX IF NOT EXISTS idx_sort_category
                ON sort_events(category);
        """)

        # Seed default LLM providers
        from llm import PROVIDER_PRESETS

        for pid, preset in PROVIDER_PRESETS.items():
            conn.execute(
                """INSERT OR IGNORE INTO llm_providers
                   (id, name, api_key, base_url, model, is_active)
                   VALUES (?, ?, '', ?, ?, ?)""",
                (
                    pid,
                    preset["name"],
                    preset["base_url"],
                    preset["default_model"],
                    1 if pid == "openrouter" else 0,
                ),
            )


# ---------------------------------------------------------------------------
# Sort events
# ---------------------------------------------------------------------------


def log_sort(category, confidence, mode, label="", duration_ms=0):
    """Record a sorting event."""
    with get_db() as conn:
        conn.execute(
            """INSERT INTO sort_events
               (timestamp, category, confidence, mode, label, duration_ms)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (time.time(), category, confidence, mode, label, duration_ms),
        )


def get_recent_sorts(limit=50):
    """Return the most recent sort events."""
    with get_db() as conn:
        rows = conn.execute(
            """SELECT id, timestamp, category, confidence, mode, label, duration_ms
               FROM sort_events ORDER BY timestamp DESC LIMIT ?""",
            (limit,),
        ).fetchall()
    return [dict(r) for r in rows]


def get_stats():
    """Return aggregate sorting statistics."""
    with get_db() as conn:
        total = conn.execute("SELECT COUNT(*) FROM sort_events").fetchone()[0]

        breakdown = {}
        for cat in config.CATEGORIES:
            count = conn.execute(
                "SELECT COUNT(*) FROM sort_events WHERE category = ?", (cat,)
            ).fetchone()[0]
            breakdown[cat] = count

        avg_conf = conn.execute(
            "SELECT COALESCE(AVG(confidence), 0) FROM sort_events"
        ).fetchone()[0]

        avg_dur = conn.execute(
            "SELECT COALESCE(AVG(duration_ms), 0) FROM sort_events"
        ).fetchone()[0]

    return {
        "total_sorted": total,
        "breakdown": breakdown,
        "average_confidence": round(avg_conf, 2),
        "average_duration_ms": round(avg_dur, 1),
    }


def get_hourly_stats(hours=24):
    """Return sort counts bucketed by hour for the last N hours."""
    cutoff = time.time() - (hours * 3600)
    with get_db() as conn:
        rows = conn.execute(
            """SELECT
                   CAST(strftime('%%H', timestamp, 'unixepoch', 'localtime') AS INTEGER) AS hour,
                   COUNT(*) AS count
               FROM sort_events
               WHERE timestamp >= ?
               GROUP BY hour
               ORDER BY hour""",
            (cutoff,),
        ).fetchall()
    # Fill all 24 hours
    data = {r["hour"]: r["count"] for r in rows}
    return [{"hour": h, "count": data.get(h, 0)} for h in range(24)]


def clear_sort_history():
    """Delete all sort events from the database."""
    with get_db() as conn:
        conn.execute("DELETE FROM sort_events")


# ---------------------------------------------------------------------------
# System state
# ---------------------------------------------------------------------------


def get_state(key, default=None):
    """Read a value from the system state table."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT value FROM system_state WHERE key = ?", (key,)
        ).fetchone()
    return row["value"] if row else default


def set_state(key, value):
    """Write a value to the system state table."""
    with get_db() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO system_state (key, value) VALUES (?, ?)",
            (key, str(value)),
        )


# ---------------------------------------------------------------------------
# Servo calibration
# ---------------------------------------------------------------------------

DEFAULT_CALIBRATION = {
    "categories": {
        "general":   {"pan": -0.7, "tilt_dump": -0.6, "tilt_rest": 0.0},
        "recycling": {"pan":  0.0, "tilt_dump": -0.6, "tilt_rest": 0.0},
        "compost":   {"pan":  0.7, "tilt_dump": -0.6, "tilt_rest": 0.0},
    },
    "timing": {
        "pan_settle_s": 0.5,
        "dump_hold_s": 1.0,
        "return_s": 0.5,
    },
}


def get_calibration():
    """Return the servo calibration (categories + timing), with defaults."""
    raw = get_state("calibration")
    if not raw:
        return json.loads(json.dumps(DEFAULT_CALIBRATION))
    try:
        stored = json.loads(raw)
    except json.JSONDecodeError:
        return json.loads(json.dumps(DEFAULT_CALIBRATION))
    # Merge over defaults so new keys always exist
    merged = json.loads(json.dumps(DEFAULT_CALIBRATION))
    for cat, vals in (stored.get("categories") or {}).items():
        if cat in merged["categories"] and isinstance(vals, dict):
            merged["categories"][cat].update(vals)
    for key, val in (stored.get("timing") or {}).items():
        if key in merged["timing"]:
            merged["timing"][key] = val
    return merged


def set_calibration(data):
    """Validate and persist calibration values (partial updates allowed)."""
    current = get_calibration()

    for cat, vals in (data.get("categories") or {}).items():
        if cat not in current["categories"]:
            raise ValueError(f"Invalid category: {cat}")
        if not isinstance(vals, dict):
            raise ValueError(f"Invalid values for {cat}")
        for key in ("pan", "tilt_dump", "tilt_rest"):
            if key in vals:
                v = float(vals[key])
                if not -1.0 <= v <= 1.0:
                    raise ValueError(f"{cat}.{key} out of range (-1..1): {v}")
                current["categories"][cat][key] = round(v, 3)

    for key, val in (data.get("timing") or {}).items():
        if key not in current["timing"]:
            raise ValueError(f"Invalid timing key: {key}")
        v = float(val)
        if not 0.0 <= v <= 5.0:
            raise ValueError(f"timing.{key} out of range (0..5s): {v}")
        current["timing"][key] = round(v, 2)

    set_state("calibration", json.dumps(current))
    return current


def reset_calibration():
    """Restore default calibration."""
    set_state("calibration", json.dumps(DEFAULT_CALIBRATION))
    return get_calibration()


# ---------------------------------------------------------------------------
# Custom animation sequences
# ---------------------------------------------------------------------------


def get_sequences():
    """Return all saved custom sequences."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, name, keyframes, loop, created_at FROM sequences ORDER BY name"
        ).fetchall()
    result = []
    for r in rows:
        d = dict(r)
        try:
            d["keyframes"] = json.loads(d["keyframes"])
        except json.JSONDecodeError:
            d["keyframes"] = []
        d["loop"] = bool(d["loop"])
        result.append(d)
    return result


def get_sequence(seq_id):
    """Return a single custom sequence by ID, or None."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, name, keyframes, loop, created_at FROM sequences WHERE id = ?",
            (seq_id,),
        ).fetchone()
    if not row:
        return None
    d = dict(row)
    d["keyframes"] = json.loads(d["keyframes"])
    d["loop"] = bool(d["loop"])
    return d


def save_sequence(name, keyframes, loop=False, seq_id=None):
    """Create or update a custom sequence. Returns the sequence ID."""
    name = (name or "").strip()
    if not name:
        raise ValueError("Sequence name is required")
    if not isinstance(keyframes, list) or not keyframes:
        raise ValueError("At least one keyframe is required")
    if len(keyframes) > 100:
        raise ValueError("Too many keyframes (max 100)")

    cleaned = []
    for i, kf in enumerate(keyframes):
        if not isinstance(kf, dict):
            raise ValueError(f"Keyframe {i} is not an object")
        pan = float(kf.get("pan", 0))
        tilt = float(kf.get("tilt", 0))
        ms = int(kf.get("ms", 500))
        ease = kf.get("ease", "inout")
        if not -1.0 <= pan <= 1.0 or not -1.0 <= tilt <= 1.0:
            raise ValueError(f"Keyframe {i} position out of range")
        if not 50 <= ms <= 10000:
            raise ValueError(f"Keyframe {i} duration out of range (50-10000ms)")
        if ease not in ("linear", "in", "out", "inout", "hold"):
            raise ValueError(f"Keyframe {i} has invalid easing: {ease}")
        cleaned.append({"pan": round(pan, 3), "tilt": round(tilt, 3), "ms": ms, "ease": ease})

    with get_db() as conn:
        if seq_id is not None:
            exists = conn.execute("SELECT 1 FROM sequences WHERE id = ?", (seq_id,)).fetchone()
            if not exists:
                raise ValueError(f"Sequence not found: {seq_id}")
            conn.execute(
                "UPDATE sequences SET name = ?, keyframes = ?, loop = ? WHERE id = ?",
                (name, json.dumps(cleaned), int(bool(loop)), seq_id),
            )
            return seq_id
        cursor = conn.execute(
            "INSERT INTO sequences (name, keyframes, loop, created_at) VALUES (?, ?, ?, ?)",
            (name, json.dumps(cleaned), int(bool(loop)), time.time()),
        )
        return cursor.lastrowid


def delete_sequence(seq_id):
    """Delete a custom sequence."""
    with get_db() as conn:
        conn.execute("DELETE FROM sequences WHERE id = ?", (seq_id,))


# ---------------------------------------------------------------------------
# LLM provider settings
# ---------------------------------------------------------------------------


def get_providers():
    """Return all configured LLM providers."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, name, api_key, base_url, model, is_active FROM llm_providers"
        ).fetchall()
    providers = []
    for r in rows:
        d = dict(r)
        # Mask API key for frontend display
        d["api_key_set"] = bool(d["api_key"])
        d["api_key_masked"] = (
            d["api_key"][:4] + "..." + d["api_key"][-4:]
            if len(d["api_key"]) > 8
            else ""
        )
        providers.append(d)
    return providers


def get_active_provider():
    """Return the currently active LLM provider (full details including key)."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, name, api_key, base_url, model FROM llm_providers WHERE is_active = 1"
        ).fetchone()
    return dict(row) if row else None


def get_provider_by_id(provider_id):
    """Return a single LLM provider by ID (full details including key)."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, name, api_key, base_url, model FROM llm_providers WHERE id = ?",
            (provider_id,),
        ).fetchone()
    return dict(row) if row else None


def update_provider(
    provider_id, api_key=None, model=None, base_url=None, is_active=None
):
    """Update an LLM provider's settings."""
    with get_db() as conn:
        # Verify provider exists
        exists = conn.execute(
            "SELECT 1 FROM llm_providers WHERE id = ?", (provider_id,)
        ).fetchone()
        if not exists:
            raise ValueError(f"Unknown provider: {provider_id}")

        if api_key is not None:
            conn.execute(
                "UPDATE llm_providers SET api_key = ? WHERE id = ?",
                (api_key, provider_id),
            )
        if model is not None:
            conn.execute(
                "UPDATE llm_providers SET model = ? WHERE id = ?",
                (model, provider_id),
            )
        if base_url is not None:
            conn.execute(
                "UPDATE llm_providers SET base_url = ? WHERE id = ?",
                (base_url, provider_id),
            )
        if is_active is not None and is_active:
            # Deactivate all others, activate this one
            conn.execute("UPDATE llm_providers SET is_active = 0")
            conn.execute(
                "UPDATE llm_providers SET is_active = 1 WHERE id = ?",
                (provider_id,),
            )
