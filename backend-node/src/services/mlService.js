import axios from 'axios';

const PYTHON_ML_SERVICE_URL = process.env.PYTHON_ML_SERVICE_URL || 'http://localhost:8000';
const PYTHON_ML_SERVICE_TIMEOUT = parseInt(process.env.PYTHON_ML_SERVICE_TIMEOUT || '30000');

/**
 * Call Python ML service for career prediction
 */
export const predictCareer = async (inputData) => {
  try {
    const response = await axios.post(
      `${PYTHON_ML_SERVICE_URL}/predict`,
      inputData,
      {
        timeout: PYTHON_ML_SERVICE_TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('ML Service Error:', error.message);

    // If ML service is not available, use local prediction fallback
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.log('Using local prediction fallback...');
      return predictCareerLocally(inputData);
    }

    if (error.response) {
      return {
        success: false,
        error: error.response.data?.detail || error.response.data?.message || 'Prediction failed'
      };
    }

    return {
      success: false,
      error: 'Failed to get prediction from ML service'
    };
  }
};

/**
 * Get list of available careers from Python ML service
 */
export const getCareers = async () => {
  try {
    const response = await axios.get(
      `${PYTHON_ML_SERVICE_URL}/careers`,
      {
        timeout: PYTHON_ML_SERVICE_TIMEOUT
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('ML Service Error:', error.message);
    
    // Return fallback careers if service is unavailable
    const fallbackCareers = [
      'Software Engineer',
      'Data Scientist',
      'Product Manager',
      'UX/UI Designer',
      'DevOps Engineer',
      'Cybersecurity Analyst'
    ];

    return {
      success: true,
      data: { careers: fallbackCareers }
    };
  }
};

/**
 * Generate learning path (can be enhanced with AI/ML service)
 */
export const generateLearningPath = async (inputData) => {
  try {
    // Try to call Python service if it has this endpoint
    const response = await axios.post(
      `${PYTHON_ML_SERVICE_URL}/generate-path`,
      inputData,
      {
        timeout: PYTHON_ML_SERVICE_TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    // If Python service doesn't have this endpoint, generate locally
    return generateLearningPathLocally(inputData);
  }
};

/**
 * Generate learning path locally (fallback)
 */
const generateLearningPathLocally = (inputData) => {
  const { career_path, current_skills, experience_level, time_commitment, learning_style } = inputData;

  // Generate phases based on experience level
  const phases = [];
  if (experience_level === 'beginner') {
    phases.push(
      {
        phase: 'Foundation',
        duration: '2-3 months',
        topics: ['Basic concepts', 'Fundamentals', 'Introduction to tools']
      },
      {
        phase: 'Intermediate',
        duration: '3-4 months',
        topics: ['Advanced concepts', 'Practical projects', 'Best practices']
      },
      {
        phase: 'Advanced',
        duration: '2-3 months',
        topics: ['Expert-level skills', 'Real-world projects', 'Industry standards']
      }
    );
  } else if (experience_level === 'intermediate') {
    phases.push(
      {
        phase: 'Advanced Skills',
        duration: '2-3 months',
        topics: ['Advanced techniques', 'Complex projects', 'Industry best practices']
      },
      {
        phase: 'Specialization',
        duration: '3-4 months',
        topics: ['Specialized knowledge', 'Expert-level projects', 'Leadership skills']
      }
    );
  } else {
    phases.push(
      {
        phase: 'Expert Level',
        duration: '2-3 months',
        topics: ['Master-level concepts', 'Complex projects', 'Mentoring others']
      }
    );
  }

  const skillsToAcquire = [
    'Technical expertise',
    'Problem-solving',
    'Communication',
    'Team collaboration'
  ];

  const certifications = [
    'Industry-recognized certification',
    'Advanced specialization certificate'
  ];

  const jobSearchTips = [
    'Build a strong portfolio',
    'Network with industry professionals',
    'Prepare for technical interviews',
    'Stay updated with industry trends'
  ];

  const salaryInsights = {
    entry: '$50,000 - $70,000',
    mid: '$70,000 - $100,000',
    senior: '$100,000 - $150,000+'
  };

  return {
    success: true,
    data: {
      career_path,
      overview: `A comprehensive learning path for ${career_path} designed for ${experience_level} level learners. This path will help you build the necessary skills and knowledge to succeed in this field.`,
      learning_phases: phases,
      skills_to_acquire: skillsToAcquire,
      certifications,
      job_search_tips: jobSearchTips,
      salary_insights: salaryInsights
    }
  };
};

/**
 * Local prediction fallback when ML service is unavailable
 */
const predictCareerLocally = (inputData) => {
  const { education, skills, interests, years_experience } = inputData;

  // Career mapping based on skills and interests
  const careerMap = {
    'software': ['Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer'],
    'data': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Data Engineer'],
    'design': ['UX/UI Designer', 'Product Designer', 'Graphic Designer', 'Web Designer'],
    'management': ['Product Manager', 'Project Manager', 'Business Analyst', 'Scrum Master'],
    'security': ['Cybersecurity Analyst', 'Security Engineer', 'Penetration Tester', 'Security Consultant'],
    'devops': ['DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer', 'Infrastructure Engineer'],
    'mobile': ['Mobile Developer', 'iOS Developer', 'Android Developer', 'React Native Developer'],
    'ai': ['AI Engineer', 'Machine Learning Engineer', 'NLP Engineer', 'Computer Vision Engineer'],
    'web': ['Web Developer', 'Frontend Developer', 'Full Stack Developer', 'Web Designer'],
    'database': ['Database Administrator', 'Data Engineer', 'Database Developer', 'Data Architect']
  };

  // Combine skills and interests
  const allKeywords = [...(Array.isArray(skills) ? skills : [skills]),
                       ...(Array.isArray(interests) ? interests : [interests])].join(' ').toLowerCase();

  // Find matching careers based on keywords
  let matchedCareers = [];
  for (const [keyword, careers] of Object.entries(careerMap)) {
    if (allKeywords.includes(keyword)) {
      matchedCareers.push(...careers);
    }
  }

  // If no matches found, provide default tech careers
  if (matchedCareers.length === 0) {
    matchedCareers = ['Software Engineer', 'Data Analyst', 'Product Manager', 'UX/UI Designer'];
  }

  // Remove duplicates
  matchedCareers = [...new Set(matchedCareers)];

  // Primary career is the first match
  const primary_career = matchedCareers[0];

  // Alternative careers are the rest
  const alternative_careers = matchedCareers.slice(1, 4).map((career, index) => ({
    career,
    confidence: Math.max(0.75 - (index * 0.1), 0.55)
  }));

  // Calculate confidence based on education and experience
  let baseConfidence = 0.70;
  if (education === 'Bachelor' || education === 'Master' || education === 'PhD') {
    baseConfidence += 0.10;
  }
  if (years_experience >= 2) {
    baseConfidence += 0.05;
  }
  if (years_experience >= 5) {
    baseConfidence += 0.05;
  }

  const confidence = Math.min(baseConfidence, 0.95);

  // Generate recommendations based on the prediction
  const recommendations = [
    `Build a strong portfolio showcasing ${primary_career} projects`,
    `Gain hands-on experience with industry-standard tools and technologies`,
    `Network with professionals in the ${primary_career} field`,
    `Consider obtaining relevant certifications to boost your credentials`,
    `Stay updated with latest trends and best practices in the industry`
  ];

  return {
    success: true,
    data: {
      primary_career,
      confidence: parseFloat(confidence.toFixed(2)),
      alternative_careers,
      skills_match: Math.floor(confidence * 100),
      recommendations,
      note: 'Prediction generated using local fallback algorithm'
    }
  };
};

