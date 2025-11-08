# llm_service.py — Dynamic version (no hard-coded model names, ports, or URLs)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# -----------------------------------------------------
# Dynamic Configuration
# -----------------------------------------------------

SERVICE_NAME = os.getenv("SERVICE_NAME", "Career Learning Path API")
SERVICE_VERSION = os.getenv("SERVICE_VERSION", "2.0")

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4")
SERVER_HOST = os.getenv("LLM_HOST", "0.0.0.0")
SERVER_PORT = int(os.getenv("LLM_PORT", "8001"))

SEARCH_API = os.getenv("SEARCH_API", "https://api.duckduckgo.com/")
DEFAULT_RESOURCE_URL = os.getenv("DEFAULT_RESOURCE_URL", "https://www.example.com/guide")

# Optional search settings
MAX_WEB_RESULTS = int(os.getenv("MAX_WEB_RESULTS", "5"))
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "5"))

# -----------------------------------------------------
# Conditional Imports
# -----------------------------------------------------
try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False

# -----------------------------------------------------
# FastAPI App Setup
# -----------------------------------------------------

app = FastAPI(title=SERVICE_NAME, version=SERVICE_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
# Data Models
# -----------------------------------------------------

class LearningPathRequest(BaseModel):
    career_path: str
    current_skills: Optional[List[str]] = []
    experience_level: Optional[str] = "beginner"
    time_commitment: Optional[str] = "3-6 months"
    learning_style: Optional[str] = "mixed"

class LearningPathResponse(BaseModel):
    career: str
    overview: str
    learning_phases: List[Dict]
    recommended_resources: List[Dict]
    estimated_timeline: str
    skills_to_acquire: List[str]
    certifications: List[str]
    job_search_tips: List[str]
    salary_insights: Dict
    web_resources: List[Dict]

# -----------------------------------------------------
# Helper: Web Search
# -----------------------------------------------------

def search_web(query: str, num_results: int = MAX_WEB_RESULTS) -> List[Dict]:
    try:
        params = {"q": query, "format": "json", "no_html": 1, "skip_disambig": 1}
        response = requests.get(SEARCH_API, params=params, timeout=REQUEST_TIMEOUT)
        data = response.json()
        results = []

        if "RelatedTopics" in data:
            for topic in data["RelatedTopics"][:num_results]:
                if isinstance(topic, dict) and "Text" in topic:
                    results.append({
                        "title": topic.get("Text", "")[:100],
                        "url": topic.get("FirstURL", ""),
                        "snippet": topic.get("Text", ""),
                        "source": "DuckDuckGo"
                    })

        if not results:
            results = [
                {
                    "title": f"{query} - Complete Guide",
                    "url": f"{DEFAULT_RESOURCE_URL}/{query.replace(' ', '-')}",
                    "snippet": f"Comprehensive guide for learning {query}",
                    "source": "Educational Resource"
                },
                {
                    "title": f"Top Courses for {query}",
                    "url": "https://www.coursera.org",
                    "snippet": "Online courses and certifications",
                    "source": "Coursera"
                }
            ]
        return results[:num_results]

    except Exception as e:
        print(f"Web search error: {str(e)}")
        return []

# -----------------------------------------------------
# Helper: Generate Learning Path (Claude / OpenAI / Fallback)
# -----------------------------------------------------

def generate_learning_path_with_claude(request: LearningPathRequest) -> Dict:
    if not HAS_ANTHROPIC or not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="Claude API key not configured")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    prompt = f"""
    Create a structured JSON learning path for someone becoming a {request.career_path}.
    Current skills: {', '.join(request.current_skills)}
    Level: {request.experience_level}
    Time: {request.time_commitment}
    Learning style: {request.learning_style}
    """

    message = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    response_text = message.content[0].text
    try:
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        if start_idx != -1:
            return json.loads(response_text[start_idx:end_idx])
    except:
        pass
    return {"overview": response_text[:400]}

def generate_learning_path_with_openai(request: LearningPathRequest) -> Dict:
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    import openai
    openai.api_key = OPENAI_API_KEY
    prompt = f"""
    Create a JSON learning roadmap for becoming a {request.career_path}.
    Current skills: {', '.join(request.current_skills)}
    Experience: {request.experience_level}
    Time: {request.time_commitment}
    """

    response = openai.ChatCompletion.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "You are an expert career coach."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000
    )
    return {"overview": response.choices[0].message.content}

# -----------------------------------------------------
# Fallback Template
# -----------------------------------------------------

def create_template_learning_path(request: LearningPathRequest) -> Dict:
    return {
        "overview": f"A path to becoming a {request.career_path}.",
        "learning_phases": [
            {"phase": "Foundation", "duration": "2 months", "topics": ["Basics", "Core Tools"]},
            {"phase": "Intermediate", "duration": "3 months", "topics": ["Projects", "Advanced Skills"]}
        ],
        "skills_to_acquire": ["Problem Solving", "Core Tools"],
        "certifications": ["Industry-recognized Certifications"],
        "job_search_tips": ["Network actively", "Build projects", "Join communities"],
        "salary_insights": {"entry_level": "$50k+", "mid_level": "$80k+", "senior_level": "$120k+"},
        "estimated_timeline": request.time_commitment
    }

# -----------------------------------------------------
# API Routes
# -----------------------------------------------------

@app.get("/")
async def root():
    return {
        "message": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "endpoints": ["/generate-path", "/search-resources", "/career-roadmap", "/health"]
    }

@app.post("/generate-path", response_model=LearningPathResponse)
async def generate_learning_path(request: LearningPathRequest):
    try:
        if HAS_ANTHROPIC and ANTHROPIC_API_KEY:
            path_data = generate_learning_path_with_claude(request)
        elif OPENAI_API_KEY:
            path_data = generate_learning_path_with_openai(request)
        else:
            path_data = create_template_learning_path(request)

        web_resources = []
        for q in [f"{request.career_path} courses", f"{request.career_path} certifications"]:
            web_resources.extend(search_web(q))

        return LearningPathResponse(
            career=request.career_path,
            overview=path_data.get("overview", ""),
            learning_phases=path_data.get("learning_phases", []),
            recommended_resources=path_data.get("recommended_resources", []),
            estimated_timeline=path_data.get("estimated_timeline", request.time_commitment),
            skills_to_acquire=path_data.get("skills_to_acquire", []),
            certifications=path_data.get("certifications", []),
            job_search_tips=path_data.get("job_search_tips", []),
            salary_insights=path_data.get("salary_insights", {}),
            web_resources=web_resources
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search-resources/{career_path}")
async def search_resources(career_path: str):
    results = search_web(career_path)
    return {"career": career_path, "resources": results, "timestamp": datetime.utcnow().isoformat()}

@app.get("/career-roadmap/{career}")
async def get_roadmap(career: str):
    default_path = os.getenv("CAREER_ROADMAP_PATH", "./career_roadmaps.json")

    if os.path.exists(default_path):
        import json
        with open(default_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if career in data:
            return data[career]

    return create_template_learning_path(LearningPathRequest(career_path=career))

@app.get("/health")
async def health_check():
    llm_provider = (
        "Claude" if (HAS_ANTHROPIC and ANTHROPIC_API_KEY)
        else "OpenAI" if OPENAI_API_KEY
        else "Template"
    )
    return {
        "status": "healthy",
        "provider": llm_provider,
        "model": ANTHROPIC_MODEL if llm_provider == "Claude" else OPENAI_MODEL,
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=SERVER_HOST, port=SERVER_PORT)
