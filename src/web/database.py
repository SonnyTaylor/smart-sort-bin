"""
AI Smart Bin - SQLite Database Layer

Handles sorting history, statistics, system state, and LLM provider settings.
"""

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

            CREATE INDEX IF NOT EXISTS idx_sort_timestamp
                ON sort_events(timestamp);

            CREATE INDEX IF NOT EXISTS idx_sort_category
                ON sort_events(category);
        """)

        # Set defaults if not present
        defaults = {
            "mode": config.DEFAULT_MODE,
            "pan_general": str(config.DEFAULT_ANGLES["general"]),
            "pan_recycling": str(config.DEFAULT_ANGLES["recycling"]),
            "pan_compost": str(config.DEFAULT_ANGLES["compost"]),
        }
        for key, value in defaults.items():
            conn.execute(
                "INSERT OR IGNORE INTO system_state (key, value) VALUES (?, ?)",
                (key, value),
            )

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


def get_mode():
    """Return the current classification mode."""
    return get_state("mode", config.DEFAULT_MODE)


def set_mode(mode):
    """Set the classification mode."""
    if mode not in (config.MODE_YOLO, config.MODE_LLM):
        raise ValueError(f"Invalid mode: {mode}")
    set_state("mode", mode)


def get_servo_angles():
    """Return the current servo angle configuration."""
    return {
        cat: int(get_state(f"pan_{cat}", config.DEFAULT_ANGLES[cat]))
        for cat in config.CATEGORIES
    }


def set_servo_angle(category, angle):
    """Update a servo angle for a waste category."""
    if category not in config.CATEGORIES:
        raise ValueError(f"Invalid category: {category}")
    angle = max(0, min(360, int(angle)))
    set_state(f"pan_{category}", angle)


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
