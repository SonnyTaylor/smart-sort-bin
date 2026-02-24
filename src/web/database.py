"""
AI Smart Bin - SQLite Database Layer

Handles sorting history, statistics, and system state persistence.
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
