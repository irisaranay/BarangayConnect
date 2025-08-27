from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.hash import bcrypt
from database import SessionLocal, engine
from models import User, Base

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

# ✅ Helper: Normalize phone to 09 format
def normalize_phone(phone: str) -> str:
    if phone.startswith("+63"):
        return "0" + phone[3:]
    return phone

# ✅ Request Models
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

# ✅ DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔐 LOGIN Route
@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    normalized_phone = normalize_phone(request.phone)
    print(f"🔑 Login attempt for: {normalized_phone}")

    # Try to find by 09 format
    user = db.query(User).filter(User.phone == normalized_phone).first()

    # If not found, try +63 format (just in case someone registered without normalization)
    if not user and normalized_phone.startswith("0"):
        alt_format = "+63" + normalized_phone[1:]
        print(f"🔁 Trying alt format: {alt_format}")
        user = db.query(User).filter(User.phone == alt_format).first()

    if not user or not bcrypt.verify(request.password, user.password):
        print("❌ Invalid credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    return {
        "message": "Login successful",
        "role": user.role,
        "user_id": user.id,
    }

@app.post("/admin-login", response_model=AdminLoginResponse)
def admin_login(request: LoginRequest, db: Session = Depends(get_db)):
    normalized_phone = normalize_phone(request.phone)

    user = db.query(User).filter(User.phone == normalized_phone).first()

    if not user and normalized_phone.startswith("0"):
        alt_format = "+63" + normalized_phone[1:]
        user = db.query(User).filter(User.phone == alt_format).first()

    if not user or not bcrypt.verify(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can log in here"
        )

    if not user.admin_type:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Admin type is required"
        )

    return {
        "message": "Admin login successful",
        "role": user.role,
        "user_id": user.id,
        "full_name": f"{user.first_name} {user.last_name}",
        "admin_type": user.admin_type  # ✅ Make sure this is returned
    }


# 📝 Registration Route
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

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }
