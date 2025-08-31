import sqlite3
from pathlib import Path
import json
from typing import Any

# Local SQLite DB path (create in project folder)
BASE_DIR = Path(__file__).parent
LOCAL_DB = BASE_DIR / "local_requests.db"

# Ensure DB exists
conn = sqlite3.connect(LOCAL_DB)
cursor = conn.cursor()

# Create table for offline storage
cursor.execute("""
CREATE TABLE IF NOT EXISTS request_forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    document_type TEXT NOT NULL,
    purpose TEXT NOT NULL,
    copies INTEGER DEFAULT 1,
    requirements TEXT DEFAULT '',
    photo TEXT DEFAULT '',
    timestamp TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    notes TEXT DEFAULT '',
    is_synced INTEGER DEFAULT 0
)
""")
conn.commit()
conn.close()


# Save request locally
def save_request_local(user_id: int, data: Any):
    """
    Save a request locally in SQLite. 
    `data` is expected to be a JSON string or dict with request fields.
    """
    if isinstance(data, str):
        data = json.loads(data)

    conn = sqlite3.connect(LOCAL_DB)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO request_forms 
        (user_id, document_type, purpose, copies, requirements, photo, timestamp, status, notes, is_synced)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        data.get("document_type"),
        data.get("purpose"),
        data.get("copies", 1),
        data.get("requirements", ""),
        data.get("photo", ""),
        data.get("timestamp"),
        data.get("status", "Pending"),
        data.get("notes", ""),
        0  # not synced
    ))
    conn.commit()
    conn.close()


# Get all unsynced requests
def get_unsynced_requests():
    conn = sqlite3.connect(LOCAL_DB)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM request_forms WHERE is_synced = 0")
    rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    requests = [dict(zip(columns, row)) for row in rows]
    conn.close()
    return requests


# Mark request as synced
def mark_as_synced_local(request_id: int):
    conn = sqlite3.connect(LOCAL_DB)
    cursor = conn.cursor()
    cursor.execute("UPDATE request_forms SET is_synced = 1 WHERE id = ?", (request_id,))
    conn.commit()
    conn.close()
