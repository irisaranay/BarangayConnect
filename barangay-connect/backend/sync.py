import requests
from database_local import SessionLocalSQLite
from models_local import UserLocal

API_URL = "http://localhost:8000/register-full"  # online FastAPI

def sync_users():
    db = SessionLocalSQLite()
    try:
        pending = db.query(UserLocal).filter(UserLocal.sync_status == "pending").all()
        for user in pending:
            data = {
                "phone": user.phone,
                "password": user.password,  # already hashed
                "role": user.role,
                "first_name": user.first_name,
                "middle_name": user.middle_name,
                "last_name": user.last_name,
                "dob": user.dob,
                "gender": user.gender,
                "civil_status": user.civil_status,
                "purok": user.purok,
                "barangay": user.barangay,
                "city": user.city,
                "province": user.province,
                "postal_code": user.postal_code,
                "selfie": user.selfie_filename,
            }
            r = requests.post(API_URL, json=data)
            if r.status_code == 200:
                user.sync_status = "synced"
                db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    sync_users()
