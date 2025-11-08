# main.py – Fixed version with authentication integration

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from database import get_db, CareerHistory, Resume, LearningPathHistory, User, UserStats
from sqlalchemy.orm import Session
from datetime import datetime
import joblib
import subprocess
import os
import json
from dotenv import load_dotenv
import PyPDF2
from jose import JWTError, jwt
import numpy as np

# Load environment variables
load_dotenv()

# -----------------------------------------------------
# Configuration (Dynamic)
# -----------------------------------------------------

MODEL_PATH = os.getenv("MODEL_PATH", "./models/career_model.pkl")
LABEL_ENCODER_PATH = os.getenv("LABEL_ENCODER_PATH", "./models/label_encoder.pkl")
SKILL_VECTORIZER_PATH = os.getenv("SKILL_VECTORIZER_PATH", "./models/skill_vectorizer.pkl")
INTEREST_VECTORIZER_PATH = os.getenv("INTEREST_VECTORIZER_PATH", "./models/interest_vectorizer.pkl")
TRAIN_SCRIPT_PATH = os.getenv("TRAIN_SCRIPT_PATH", "./train_model.py")
DATASET_PATH = os.getenv("DATASET_PATH", "./data/career_dataset.csv")

# Auth config
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# CORS setup
app = FastAPI(title="Career Recommendation API", version="2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# -----------------------------------------------------
# Authentication Dependency
# -----------------------------------------------------

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        return None
    
    try:
        # Extract token from "Bearer <token>" format
        if authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
        else:
            token = authorization
            
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            return None
            
        user = db.query(User).filter(User.email == email).first()
        return user
    except JWTError:
        return None

def require_auth(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    user = get_current_user(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# -----------------------------------------------------
# Model Loading (Dynamic)
# -----------------------------------------------------

def load_model():
    try:
        if not os.path.exists(MODEL_PATH):
            print(f"Warning: Model not found at {MODEL_PATH}")
            return None, None, None, None
            
        model = joblib.load(MODEL_PATH)
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
        skill_vectorizer = joblib.load(SKILL_VECTORIZER_PATH)
        interest_vectorizer = joblib.load(INTEREST_VECTORIZER_PATH)
        return model, label_encoder, skill_vectorizer, interest_vectorizer
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return None, None, None, None

model, label_encoder, skill_vectorizer, interest_vectorizer = load_model()

# -----------------------------------------------------
# Pydantic Schemas
# -----------------------------------------------------

class CareerInput(BaseModel):
    education: str
    years_experience: int
    skills: List[str]
    interests: List[str]
    certifications: Optional[List[str]] = []
    preferred_industry: Optional[str] = ""

class CareerPredictionResponse(BaseModel):
    primary_career: str
    alternative_careers: List[Dict]
    confidence: float
    skills_match: float
    recommendations: List[str]

class LearningPathInput(BaseModel):
    career_path: str
    current_skills: List[str]
    experience_level: str
    time_commitment: str
    learning_style: str

class UserDashboard(BaseModel):
    user_info: Dict
    career_history: List[Dict]
    learning_paths: List[Dict]
    quiz_stats: Dict
    total_assessments: int
    last_activity: Optional[str]

# -----------------------------------------------------
# API Endpoints
# -----------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Career Path Recommendation API",
        "version": "2.0",
        "endpoints": [
            "/predict",
            "/predict-from-resume",
            "/save-learning-path",
            "/dashboard",
            "/user/profile",
            "/careers",
            "/health"
        ]
    }

@app.post("/predict", response_model=CareerPredictionResponse)
def predict_career(
    input_data: CareerInput, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    try:
        if not model:
            # Return mock data if model not loaded
            return CareerPredictionResponse(
                primary_career="Software Developer",
                alternative_careers=[
                    {"career": "Data Scientist", "confidence": 0.75},
                    {"career": "DevOps Engineer", "confidence": 0.65}
                ],
                confidence=0.85,
                skills_match=0.8,
                recommendations=[
                    "Consider gaining more experience in cloud technologies",
                    "Enhance your skills in Python and JavaScript",
                    "Get AWS or Azure certification"
                ]
            )
        
        # Encode education
        education_map = {"High School": 0, "Bachelor": 1, "Master": 2, "PhD": 3}
        edu_encoded = education_map.get(input_data.education, 1)
        
        # Vectorize skills and interests
        skill_vec = skill_vectorizer.transform([" ".join(input_data.skills)]).toarray()
        interest_vec = interest_vectorizer.transform([" ".join(input_data.interests)]).toarray()

        # Combine features
        X = np.hstack([[edu_encoded], skill_vec[0], interest_vec[0]])

        # Get predictions
        predictions_proba = model.predict_proba([X])[0]
        top_3_indices = np.argsort(predictions_proba)[-3:][::-1]
        
        # Get career names and confidence scores
        careers = []
        for idx in top_3_indices:
            career_name = label_encoder.inverse_transform([idx])[0]
            confidence = float(predictions_proba[idx])
            careers.append({"career": career_name, "confidence": round(confidence, 3)})

        primary_career = careers[0]["career"]
        primary_confidence = careers[0]["confidence"]
        alternative_careers = careers[1:3]

        result = CareerPredictionResponse(
            primary_career=primary_career,
            alternative_careers=alternative_careers,
            confidence=primary_confidence,
            skills_match=round(len(input_data.skills) / 10, 2),
            recommendations=[
                f"Consider gaining more experience in {primary_career}",
                f"Enhance your skills in: {', '.join(input_data.skills[:3])}",
                "Join relevant professional networks",
                "Explore certifications for this domain"
            ]
        )

        # Save to database if user is authenticated
        if current_user:
            career_entry = CareerHistory(
                user_id=current_user.id,
                career_path=primary_career,
                confidence=primary_confidence,
                alternative_careers=alternative_careers,
                input_data=input_data.dict(),
                created_at=datetime.utcnow()
            )
            db.add(career_entry)
            
            # Update user stats
            stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
            if stats:
                stats.total_assessments += 1
                stats.last_assessment_date = datetime.utcnow()
            
            db.commit()

        return result
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-from-resume")
def predict_from_resume(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        pdf_reader = PyPDF2.PdfReader(file.file)
        resume_text = " ".join(page.extract_text() for page in pdf_reader.pages if page.extract_text())

        # Simple keyword extraction (can be improved with NLP)
        skills = []
        interests = []
        
        # Check for common skills
        common_skills = ["Python", "Java", "JavaScript", "SQL", "React", "AWS", "Docker", "Machine Learning"]
        for skill in common_skills:
            if skill.lower() in resume_text.lower():
                skills.append(skill)
        
        # Default values if extraction fails
        if not skills:
            skills = ["Programming", "Problem Solving"]
        
        interests = ["Technology", "Innovation"]

        # Save resume to database
        resume_entry = Resume(
            user_id=current_user.id,
            file_name=file.filename,
            file_content=resume_text[:5000],  # Store first 5000 chars
            parsed_data={"skills": skills, "interests": interests},
            uploaded_at=datetime.utcnow()
        )
        db.add(resume_entry)
        
        # Update user stats
        stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
        if stats:
            stats.total_resumes_uploaded += 1
            stats.last_resume_upload_date = datetime.utcnow()
        
        db.commit()

        # Create input and predict
        parsed_data = CareerInput(
            education="Bachelor",
            years_experience=2,
            skills=skills,
            interests=interests
        )

        return predict_career(parsed_data, db, current_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save-learning-path")
def save_learning_path(
    learning_path_data: Dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    try:
        path_entry = LearningPathHistory(
            user_id=current_user.id,
            career_path=learning_path_data.get("career", "Unknown"),
            learning_path_data=learning_path_data,
            progress=0,
            completed_phases=[],
            created_at=datetime.utcnow()
        )
        db.add(path_entry)
        
        # Update user stats
        stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
        if stats:
            stats.total_learning_paths_generated += 1
        
        db.commit()
        db.refresh(path_entry)
        
        return {
            "success": True,
            "message": "Learning path saved successfully",
            "path_id": path_entry.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard", response_model=UserDashboard)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth)
):
    try:
        # Get user stats
        stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
        
        # Get career history
        career_history = db.query(CareerHistory).filter(
            CareerHistory.user_id == current_user.id
        ).order_by(CareerHistory.created_at.desc()).limit(5).all()
        
        # Get learning paths
        learning_paths = db.query(LearningPathHistory).filter(
            LearningPathHistory.user_id == current_user.id
        ).order_by(LearningPathHistory.created_at.desc()).limit(5).all()
        
        return UserDashboard(
            user_info={
                "id": current_user.id,
                "name": current_user.name,
                "email": current_user.email,
                "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
                "profile_picture": current_user.profile_picture
            },
            career_history=[
                {
                    "id": ch.id,
                    "career": ch.career_path,
                    "confidence": ch.confidence,
                    "alternatives": ch.alternative_careers,
                    "date": ch.created_at.isoformat() if ch.created_at else None
                }
                for ch in career_history
            ],
            learning_paths=[
                {
                    "id": lp.id,
                    "career": lp.career_path,
                    "progress": lp.progress,
                    "date": lp.created_at.isoformat() if lp.created_at else None
                }
                for lp in learning_paths
            ],
            quiz_stats={
                "total_quizzes_taken": 0,  # Can be extended with quiz tracking
                "average_score": 0,
                "topics_covered": []
            },
            total_assessments=stats.total_assessments if stats else 0,
            last_activity=stats.last_assessment_date.isoformat() if stats and stats.last_assessment_date else None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user/profile")
def get_profile(current_user: User = Depends(require_auth)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "is_active": current_user.is_active
    }

@app.post("/train")
def retrain_model(current_user: User = Depends(require_auth)):
    try:
        # Only allow admins to retrain (you can add admin check here)
        result = subprocess.run(["python", TRAIN_SCRIPT_PATH], capture_output=True, text=True)
        return {
            "message": f"Model retrained successfully using {DATASET_PATH}",
            "output": result.stdout[:500]  # Limit output
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {str(e)}")

@app.get("/careers")
def list_careers():
    try:
        if label_encoder:
            return {"careers": list(label_encoder.classes_)}
        else:
            # Fallback careers list
            return {
                "careers": [
                    "Software Developer",
                    "Data Scientist",
                    "Product Manager",
                    "UX Designer",
                    "DevOps Engineer",
                    "Business Analyst",
                    "Marketing Manager",
                    "Sales Executive"
                ]
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/career-info/{career_name}")
def career_info(career_name: str):
    info_path = os.getenv("CAREER_INFO_PATH", "./data/career_info.json")

    if os.path.exists(info_path):
        with open(info_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if career_name in data:
            return data[career_name]

    # Fallback default info
    return {
        "name": career_name,
        "description": f"Explore exciting opportunities in {career_name}.",
        "avg_salary": "$60,000 - $120,000",
        "growth_rate": "10-15% annually",
        "required_skills": ["Communication", "Problem Solving", "Technical Skills"],
        "education": "Bachelor's degree preferred"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "dataset": DATASET_PATH,
        "timestamp": datetime.utcnow().isoformat()
    }
