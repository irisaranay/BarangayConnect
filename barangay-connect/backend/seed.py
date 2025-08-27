from database import SessionLocal, Base, engine
from models import User
from passlib.hash import bcrypt

# Create tables if not exist
Base.metadata.create_all(bind=engine)

# Start DB session
db = SessionLocal()

# Insert sample user
sample_user = User(
    phone="09123456789",
    password=bcrypt.hash("password123"),  # hash the password
    role="resident"  # or "admin"
)

# Check if user already exists
existing_user = db.query(User).filter_by(phone=sample_user.phone).first()
if existing_user:
    print("User already exists.")
else:
    db.add(sample_user)
    db.commit()
    print("✅ Sample user inserted successfully.")

db.close()
