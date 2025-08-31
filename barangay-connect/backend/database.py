from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# ------------------------
# Online PostgreSQL (AWS)
# ------------------------
DATABASE_URL = os.getenv("DATABASE_URL")  # from AWS RDS
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is not set. Check your .env file!")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ------------------------
# Local SQLite (offline)
# ------------------------
LOCAL_DB_URL = "sqlite:///local.db"
local_engine = create_engine(LOCAL_DB_URL, connect_args={"check_same_thread": False})
LocalSession = sessionmaker(autocommit=False, autoflush=False, bind=local_engine)

# ------------------------
# Base
# ------------------------
Base = declarative_base()
