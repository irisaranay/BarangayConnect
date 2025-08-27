from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Local SQLite DB (offline cache)
SQLALCHEMY_DATABASE_URL = "sqlite:///./offline_cache.db"

engine_local = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocalSQLite = sessionmaker(autocommit=False, autoflush=False, bind=engine_local)

BaseLocal = declarative_base()
