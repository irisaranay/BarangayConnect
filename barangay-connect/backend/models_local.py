# models_local.py
from sqlalchemy import Column, Integer, String
from database_local import BaseLocal  # bound to SQLite

class UserLocal(BaseLocal):
    __tablename__ = "users_local"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="resident")
    admin_type = Column(String)

    first_name = Column(String)
    middle_name = Column(String)
    last_name = Column(String)
    dob = Column(String)
    gender = Column(String)
    civil_status = Column(String)

    purok = Column(String)
    barangay = Column(String)
    city = Column(String)
    province = Column(String)
    postal_code = Column(String)

    selfie_filename = Column(String)

    # ✅ extra field for offline sync
    sync_status = Column(String, default="pending")
