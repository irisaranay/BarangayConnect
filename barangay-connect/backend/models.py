from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Login info
    phone = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="resident")
    admin_type = Column(String) 
    
    # Personal info
    first_name = Column(String)
    middle_name = Column(String)
    last_name = Column(String)
    dob = Column(String)  # ISO format string: YYYY-MM-DD
    gender = Column(String)
    civil_status = Column(String)

    # Address info
    purok = Column(String)
    barangay = Column(String)
    city = Column(String)
    province = Column(String)
    postal_code = Column(String)

    # Optional selfie filename
    selfie_filename = Column(String)  # stored file name or path
