# database.py — Dynamic version (no hard-coded values)

from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, ForeignKey, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# -----------------------------------------------------
# Dynamic Database Configuration
# -----------------------------------------------------

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./careerpath.db")

# Optional SQLAlchemy settings
ECHO_SQL = os.getenv("SQL_ECHO", "False").lower() == "true"
POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "5"))
MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "10"))

# Engine configuration (SQLite or other)
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_size=POOL_SIZE,
    max_overflow=MAX_OVERFLOW,
    echo=ECHO_SQL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# -----------------------------------------------------
# Database Dependency
# -----------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------------------------------
# Database Models
# -----------------------------------------------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Integer, default=1)
    profile_picture = Column(String(500), nullable=True)

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    career_history = relationship("CareerHistory", back_populates="user", cascade="all, delete-orphan")
    user_stats = relationship("UserStats", back_populates="user", uselist=False, cascade="all, delete-orphan")
    learning_paths = relationship("LearningPathHistory", back_populates="user", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_content = Column(Text, nullable=True)
    parsed_data = Column(JSON, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=1)

    user = relationship("User", back_populates="resumes")

class CareerHistory(Base):
    __tablename__ = "career_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    career_path = Column(String(255), nullable=False)
    confidence = Column(Float, nullable=True)
    alternative_careers = Column(JSON, nullable=True)
    input_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="career_history")

class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    total_assessments = Column(Integer, default=0)
    total_resumes_uploaded = Column(Integer, default=0)
    total_learning_paths_generated = Column(Integer, default=0)
    last_assessment_date = Column(DateTime, nullable=True)
    last_resume_upload_date = Column(DateTime, nullable=True)
    favorite_careers = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="user_stats")

class LearningPathHistory(Base):
    __tablename__ = "learning_path_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    career_path = Column(String(255), nullable=False)
    learning_path_data = Column(JSON, nullable=True)
    progress = Column(Integer, default=0)
    completed_phases = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="learning_paths")

# -----------------------------------------------------
# Database Initialization
# -----------------------------------------------------

def init_db():
    """Initialize all tables dynamically."""
    Base.metadata.create_all(bind=engine)
    print(f"✅ Database initialized using: {DATABASE_URL}")

if __name__ == "__main__":
    init_db()
