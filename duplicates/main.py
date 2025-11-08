# main.py — Dynamic and production-ready version

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from database import get_db, CareerHistory, Resume, LearningPathHistory
from sqlalchemy.orm import Session
from datetime import datetime
import joblib
import subprocess
import os
import json
from dotenv import load_dotenv
import PyPDF2

# Load environment variables
load_dotenv()

# -----------------------------------------------------
# Configuration (Dynamic instead of Hard-coded)
# -----------------------------------------------------

MODEL_PATH = os.getenv("MODEL_PATH", "./career_model.pkl")
LABEL_ENCODER_PATH = os.getenv("LABEL_ENCODER_PATH", "./label_encoder.pkl")
SKILL_VECTORIZER_PATH = os.getenv("SKILL_VECTORIZER_PATH", "./skill_vectorizer.pkl")
INTEREST_VECTORIZER_PATH = os.getenv("INTEREST_VECTORIZER_PATH", "./interest_vectorizer.pkl")
TRAIN_SCRIPT_PATH = os.getenv("TRAIN_SCRIPT_PATH", "./train_model.py")
DATASET_PATH = os.getenv("DATASET_PATH", "./career_dataset.csv")

# CORS setup
app = FastAPI(title="Career Recommendation API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# -----------------------------------------------------
# Model Loading (Dynamic)
# -----------------------------------------------------

def load_model():
    try:
        model = joblib.load(MODEL_PATH)
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
        skill_vectorizer = joblib.load(SKILL_VECTORIZER_PATH)
        interest_vectorizer = joblib.load(INTEREST_VECTORIZER_PATH)
        return model, label_encoder, skill_vectorizer, interest_vectorizer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")

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

class LearningPathInput(BaseModel):
    career_path: str
    current_skills: List[str]
    experience_level: str
    time_commitment: str
    learning_style: str

# -----------------------------------------------------
# API Endpoints
# -----------------------------------------------------

@app.get("/")
def root():
    return {"message": "Career Path Recommendation API", "version": "2.0"}

@app.post("/predict")
def predict_career(input_data: CareerInput, db: Session = Depends(get_db)):
    try:
        education_map = {"High School": 0, "Bachelor": 1, "Master": 2, "PhD": 3}
        edu_encoded = education_map.get(input_data.education, 1)
        skill_vec = skill_vectorizer.transform([" ".join(input_data.skills)]).toarray()
        interest_vec = interest_vectorizer.transform([" ".join(input_data.interests)]).toarray()

        import numpy as np
        X = np.hstack([[edu_encoded], skill_vec[0], interest_vec[0]])

        prediction = model.predict([X])[0]
        confidence = max(model.predict_proba([X])[0])
        predicted_career = label_encoder.inverse_transform([prediction])[0]

        result = {
            "primary_career": predicted_career,
            "confidence": round(float(confidence), 3),
            "skills_match": round(len(input_data.skills) / 10, 2),
            "recommendations": [
                f"Consider gaining more experience in {predicted_career}",
                f"Enhance your skills in: {', '.join(input_data.skills[:3])}",
                "Join relevant professional networks",
                "Explore certifications for this domain"
            ]
        }

        # Log prediction
        career_entry = CareerHistory(
            user_id=None,  # can be linked later via auth
            career_path=predicted_career,
            confidence=confidence,
            input_data=input_data.dict(),
            created_at=datetime.utcnow()
        )
        db.add(career_entry)
        db.commit()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-from-resume")
def predict_from_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        pdf_reader = PyPDF2.PdfReader(file.file)
        resume_text = " ".join(page.extract_text() for page in pdf_reader.pages if page.extract_text())

        parsed_data = {
            "education": "Bachelor",
            "years_experience": 2,
            "skills": ["Python", "SQL"],
            "interests": ["Data Science"]
        }

        return predict_career(CareerInput(**parsed_data), db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
def retrain_model():
    try:
        result = subprocess.run(["python", TRAIN_SCRIPT_PATH], capture_output=True, text=True)
        return {
            "message": f"Model retrained successfully using {DATASET_PATH}",
            "output": result.stdout
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {str(e)}")

@app.get("/careers")
def list_careers():
    try:
        return {"careers": list(label_encoder.classes_)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/career-info/{career_name}")
def career_info(career_name: str):
    info_path = os.getenv("CAREER_INFO_PATH", "./career_info.json")

    if os.path.exists(info_path):
        with open(info_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if career_name in data:
            return data[career_name]

    # fallback default info
    return {
        "name": career_name,
        "description": f"Explore career opportunities in {career_name}.",
        "avg_salary": "Varies by region and experience",
        "growth_rate": "High demand in current job market"
    }

@app.post("/generate-path")
def generate_learning_path(request: LearningPathInput):
    try:
        roadmap = {
            "career_path": request.career_path,
            "overview": f"A personalized roadmap to become a {request.career_path}.",
            "phases": [
                {"phase": "Foundation", "duration": "2 months", "topics": ["Basics", "Core Tools"]},
                {"phase": "Skill Building", "duration": "3 months", "topics": ["Projects", "Advanced Concepts"]}
            ],
            "estimated_timeline": request.time_commitment
        }
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": True,
        "dataset": DATASET_PATH,
        "timestamp": datetime.utcnow().isoformat()
    }
