from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.hash import bcrypt
from typing import List, Any

from database import SessionLocal, engine, Base
from models import User, RequestForm

from database_local import save_request_local, get_unsynced_requests, mark_as_synced_local
from sync import sync_to_online

# 🔧 Auto-create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# 🔓 CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Helpers ------------------ #
def normalize_phone(phone: str) -> str:
    if phone.startswith("+63"):
        return "0" + phone[3:]
    return phone

# ------------------ Request Models ------------------ #
class LoginRequest(BaseModel):
    phone: str
    password: str

class RegisterFullRequest(BaseModel):
    phone: str
    password: str
    role: str
    first_name: str
    middle_name: str
    last_name: str
    dob: str
    gender: str
    civil_status: str
    purok: str
    barangay: str
    city: str
    province: str
    postal_code: str
    selfie: str  # base64 image string

class AdminLoginResponse(BaseModel):
    message: str
    role: str
    user_id: int
    full_name: str
    admin_type: str

class RequestFormCreate(BaseModel):
    document_type: str
    purpose: str
    copies: int
    requirements: str = ""
    photo: str = ""
    timestamp: str
    status: str = "Pending"
    notes: str = ""
    user_id: int  # Link to existing user

class RequestFormResponse(RequestFormCreate):
    id: int

    class Config:
        orm_mode = True

# ------------------ DB Dependency ------------------ #
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------ LOGIN Routes ------------------ #
@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    normalized_phone = normalize_phone(request.phone)

    user = db.query(User).filter(User.phone == normalized_phone).first()
    if not user and normalized_phone.startswith("0"):
        alt_format = "+63" + normalized_phone[1:]
        user = db.query(User).filter(User.phone == alt_format).first()

    if not user or not bcrypt.verify(request.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return {"message": "Login successful", "role": user.role, "user_id": user.id}

@app.post("/admin-login", response_model=AdminLoginResponse)
def admin_login(request: LoginRequest, db: Session = Depends(get_db)):
    normalized_phone = normalize_phone(request.phone)

    user = db.query(User).filter(User.phone == normalized_phone).first()
    if not user and normalized_phone.startswith("0"):
        alt_format = "+63" + normalized_phone[1:]
        user = db.query(User).filter(User.phone == alt_format).first()

    if not user or not bcrypt.verify(request.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if user.role.lower() != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can log in here")
    if not user.admin_type:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Admin type is required")

    return {
        "message": "Admin login successful",
        "role": user.role,
        "user_id": user.id,
        "full_name": f"{user.first_name} {user.last_name}",
        "admin_type": user.admin_type
    }

# ------------------ Registration ------------------ #
@app.post("/register-full")
def register_full(request: RegisterFullRequest, db: Session = Depends(get_db)):
    normalized_phone = normalize_phone(request.phone)

    existing_user = db.query(User).filter(User.phone == normalized_phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = bcrypt.hash(request.password)
    new_user = User(
        phone=normalized_phone,
        password=hashed_password,
        role=request.role,
        first_name=request.first_name,
        middle_name=request.middle_name,
        last_name=request.last_name,
        dob=request.dob,
        gender=request.gender,
        civil_status=request.civil_status,
        purok=request.purok,
        barangay=request.barangay,
        city=request.city,
        province=request.province,
        postal_code=request.postal_code,
        selfie_filename=request.selfie
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user_id": new_user.id}


# ------------------ Offline / Sync Routes ------------------ #
@app.post("/submit_form/")
def submit_form(user_id: int, data: Any, db: Session = Depends(get_db)):
    """
    1️⃣ Save locally for offline support
    2️⃣ Also save online in PostgreSQL
    """
    # Save locally
    save_request_local(user_id, data)

    # Save online
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_request = RequestForm(
        user_id=user.id,
        document_type=data.get("document_type"),
        purpose=data.get("purpose"),
        copies=data.get("copies", 1),
        requirements=data.get("requirements", ""),
        photo=data.get("photo", ""),
        timestamp=data.get("timestamp"),
        status=data.get("status", "Pending"),
        notes=data.get("notes", "")
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return {"message": "Form saved locally and online", "request_id": new_request.id}

@app.post("/sync/")
def sync():
    try:
        result = sync_to_online()
        return {"message": result}
    except Exception as e:
        return {"message": "Sync failed", "error": str(e)}

# ------------------ 🔹 New FastAPI Endpoint for Angular /document-request 🔹 ------------------ #
@app.post("/document-request", response_model=RequestFormResponse)
def document_request_endpoint(request: RequestFormCreate, db: Session = Depends(get_db)):
    """
    This endpoint is meant for the Angular DocumentRequestService.
    Saves the request to PostgreSQL online.
    """
    db_request = RequestForm(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request
