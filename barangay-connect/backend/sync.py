# sync.py
import requests
from database_local import get_unsynced_requests, mark_as_synced_local

# URL of your online FastAPI backend
ONLINE_API_URL = "http://16.176.16.134:8000/request"

def sync_to_online():
    unsynced_requests = get_unsynced_requests()
    if not unsynced_requests:
        return "No unsynced requests found."

    synced_count = 0
    errors = []

    for req in unsynced_requests:
        # Prepare payload for online DB
        payload = {
            "document_type": req["document_type"],
            "purpose": req["purpose"],
            "copies": req["copies"],
            "requirements": req["requirements"],
            "photo": req["photo"],
            "timestamp": req["timestamp"],
            "status": req.get("status", "Pending"),
            "notes": req.get("notes", ""),
            "user_id": req["user_id"]
        }

        try:
            response = requests.post(ONLINE_API_URL, json=payload, timeout=10)
            response.raise_for_status()  # Raise exception if HTTP error

            # Mark as synced locally
            mark_as_synced_local(req["id"])
            synced_count += 1

        except Exception as e:
            errors.append({"id": req["id"], "error": str(e)})

    result = f"Synced {synced_count} requests."
    if errors:
        result += f" {len(errors)} failed: {errors}"

    return result
