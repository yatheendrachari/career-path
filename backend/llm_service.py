# llm_service.py – Fixed version with proper imports

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import os
import requests
import json  # Added missing import
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
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4-turbo")
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

try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

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

class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "medium"  # easy, medium, hard
    num_questions: int = 10

class QuizResponse(BaseModel):
    topic: str
    difficulty: str
    questions: List[Dict]

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
    Create a detailed and structured JSON learning path for someone becoming a {request.career_path}.
    Current skills: {', '.join(request.current_skills) if request.current_skills else 'None'}
    Level: {request.experience_level}
    Time: {request.time_commitment}
    Learning style: {request.learning_style}
    
    Return ONLY a JSON object with the following structure:
    {{
        "overview": "Brief overview of the career path",
        "learning_phases": [
            {{
                "phase": "Phase name",
                "duration": "Duration",
                "topics": ["Topic 1", "Topic 2"],
                "resources": ["Resource 1", "Resource 2"]
            }}
        ],
        "recommended_resources": [
            {{
                "title": "Resource title",
                "type": "Type (book/course/video)",
                "url": "URL if available"
            }}
        ],
        "skills_to_acquire": ["Skill 1", "Skill 2"],
        "certifications": ["Certification 1", "Certification 2"],
        "job_search_tips": ["Tip 1", "Tip 2"],
        "salary_insights": {{
            "entry_level": "$X",
            "mid_level": "$Y",
            "senior_level": "$Z"
        }},
        "estimated_timeline": "{request.time_commitment}"
    }}
    """

    message = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    response_text = message.content[0].text
    try:
        # Try to parse JSON from response
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        if start_idx != -1 and end_idx > start_idx:
            return json.loads(response_text[start_idx:end_idx])
    except:
        pass
    
    # Fallback if JSON parsing fails
    return create_template_learning_path(request)

def generate_learning_path_with_openai(request: LearningPathRequest) -> Dict:
    if not HAS_OPENAI or not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    client = OpenAI(api_key=OPENAI_API_KEY)
    
    prompt = f"""
    Create a detailed JSON learning roadmap for becoming a {request.career_path}.
    Current skills: {', '.join(request.current_skills) if request.current_skills else 'None'}
    Experience: {request.experience_level}
    Time: {request.time_commitment}
    
    Return a JSON object with: overview, learning_phases, skills_to_acquire, certifications, job_search_tips, salary_insights, estimated_timeline
    """

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "You are an expert career coach. Return only valid JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000
    )
    
    try:
        response_text = response.choices[0].message.content
        return json.loads(response_text)
    except:
        return create_template_learning_path(request)

# -----------------------------------------------------
# Generate Quiz Function
# -----------------------------------------------------

def generate_quiz_with_openai(request: QuizRequest) -> Dict:
    if not HAS_OPENAI or not OPENAI_API_KEY:
        # Fallback to template quiz
        return create_template_quiz(request)

    client = OpenAI(api_key=OPENAI_API_KEY)
    
    prompt = f"""
    Create a quiz with {request.num_questions} multiple-choice questions about {request.topic}.
    Difficulty level: {request.difficulty}
    
    Return ONLY a JSON array where each question has this structure:
    [
        {{
            "question": "Question text",
            "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            "correct_answer": "A",
            "explanation": "Brief explanation of the answer"
        }}
    ]
    """

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert quiz creator. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=3000
        )
        
        response_text = response.choices[0].message.content
        questions = json.loads(response_text)
        return {"questions": questions}
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        return create_template_quiz(request)

# -----------------------------------------------------
# Fallback Templates
# -----------------------------------------------------

def create_template_learning_path(request: LearningPathRequest) -> Dict:
    return {
        "overview": f"A comprehensive path to becoming a successful {request.career_path}.",
        "learning_phases": [
            {
                "phase": "Foundation",
                "duration": "2 months",
                "topics": ["Basic concepts", "Core tools", "Industry overview"],
                "resources": ["Online tutorials", "Documentation"]
            },
            {
                "phase": "Intermediate",
                "duration": "3 months",
                "topics": ["Advanced concepts", "Practical projects", "Best practices"],
                "resources": ["Courses", "Books", "Projects"]
            },
            {
                "phase": "Advanced",
                "duration": "3 months",
                "topics": ["Specialization", "Real-world applications", "Portfolio building"],
                "resources": ["Advanced courses", "Mentorship", "Open source"]
            }
        ],
        "skills_to_acquire": ["Problem Solving", "Technical Skills", "Communication", "Project Management"],
        "certifications": ["Industry-recognized Certifications", "Vendor-specific Certifications"],
        "job_search_tips": ["Network actively", "Build a portfolio", "Join communities", "Practice interviews"],
        "salary_insights": {"entry_level": "$50,000+", "mid_level": "$80,000+", "senior_level": "$120,000+"},
        "estimated_timeline": request.time_commitment,
        "recommended_resources": []
    }

def create_template_quiz(request: QuizRequest) -> Dict:
    questions = []
    for i in range(request.num_questions):
        questions.append({
            "question": f"Sample question {i+1} about {request.topic}?",
            "options": [
                "A) Option 1",
                "B) Option 2",
                "C) Option 3",
                "D) Option 4"
            ],
            "correct_answer": "A",
            "explanation": f"This is a sample explanation for question {i+1}."
        })
    return {"questions": questions}

# -----------------------------------------------------
# API Routes
# -----------------------------------------------------

@app.get("/")
async def root():
    return {
        "message": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "endpoints": ["/generate-path", "/generate-quiz", "/search-resources", "/career-roadmap", "/health"]
    }

@app.post("/generate-path", response_model=LearningPathResponse)
async def generate_learning_path(request: LearningPathRequest):
    try:
        # Try different providers in order
        path_data = None
        
        if HAS_OPENAI and OPENAI_API_KEY:
            try:
                path_data = generate_learning_path_with_openai(request)
            except:
                pass
        
        if not path_data and HAS_ANTHROPIC and ANTHROPIC_API_KEY:
            try:
                path_data = generate_learning_path_with_claude(request)
            except:
                pass
        
        if not path_data:
            path_data = create_template_learning_path(request)

        # Add web resources
        web_resources = []
        search_queries = [
            f"{request.career_path} courses",
            f"{request.career_path} certifications",
            f"{request.career_path} learning resources"
        ]
        
        for query in search_queries:
            web_resources.extend(search_web(query, 2))

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
            web_resources=web_resources[:10]  # Limit to 10 resources
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    try:
        quiz_data = generate_quiz_with_openai(request)
        
        return QuizResponse(
            topic=request.topic,
            difficulty=request.difficulty,
            questions=quiz_data.get("questions", [])
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
        with open(default_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if career in data:
            return data[career]

    return create_template_learning_path(LearningPathRequest(career_path=career))

@app.get("/health")
async def health_check():
    llm_provider = "None"
    if HAS_OPENAI and OPENAI_API_KEY:
        llm_provider = "OpenAI"
    elif HAS_ANTHROPIC and ANTHROPIC_API_KEY:
        llm_provider = "Claude"
    else:
        llm_provider = "Template"
    
    return {
        "status": "healthy",
        "provider": llm_provider,
        "model": OPENAI_MODEL if llm_provider == "OpenAI" else ANTHROPIC_MODEL if llm_provider == "Claude" else "None",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=SERVER_HOST, port=SERVER_PORT)
