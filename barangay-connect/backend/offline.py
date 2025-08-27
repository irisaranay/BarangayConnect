from fastapi import FastAPI, HTTPException
from database_local import SessionLocalSQLite
from models_local import UserLocal
from passlib.hash import bcrypt
from sqlalchemy.exc import SQLAlchemyError

app_offline = FastAPI(title="Offline API")

@app_offline.post("/register-offline")
def register_offline(request: dict):
    db = SessionLocalSQLite()
    try:
        new_user = UserLocal(
            phone=request.get("phone"),
            password=bcrypt.hash(request.get("password")),
            role=request.get("role"),
            first_name=request.get("first_name"),
            middle_name=request.get("middle_name"),
            last_name=request.get("last_name"),
            dob=request.get("dob"),
            gender=request.get("gender"),
            civil_status=request.get("civil_status"),
            purok=request.get("purok"),
            barangay=request.get("barangay"),
            city=request.get("city"),
            province=request.get("province"),
            postal_code=request.get("postal_code"),
            selfie_filename=request.get("selfie"),
            sync_status="pending"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User saved offline", "user_id": new_user.id}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()

