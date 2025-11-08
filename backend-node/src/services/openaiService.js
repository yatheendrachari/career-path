import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '2000');

// Initialize OpenAI client
let openai = null;
if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
}

/**
 * Generate a personalized learning path using OpenAI
 * @param {Object} inputData - Learning path generation parameters
 * @returns {Promise<Object>} Generated learning path
 */
export const generateLearningPathWithAI = async (inputData) => {
  const { career_path, current_skills, experience_level, time_commitment, learning_style } = inputData;

  // Check if OpenAI is configured
  if (!openai) {
    console.log('OpenAI not configured, using fallback...');
    return {
      success: false,
      error: 'OpenAI API key not configured',
      useFallback: true
    };
  }

  try {
    // Construct the prompt for OpenAI
    const prompt = `You are an expert career coach and learning path designer. Generate a comprehensive, personalized learning path for someone who wants to pursue a career as a ${career_path}.

Here are the person's details:
- Career Goal: ${career_path}
- Current Skills: ${Array.isArray(current_skills) ? current_skills.join(', ') : current_skills}
- Experience Level: ${experience_level}
- Time Commitment: ${time_commitment} hours per week
- Learning Style: ${learning_style}

Please generate a detailed learning path in the following JSON format:
{
  "overview": "A brief overview of the learning path (2-3 sentences)",
  "learning_phases": [
    {
      "phase": "Phase name (e.g., Foundation, Intermediate, Advanced)",
      "duration": "Estimated duration (e.g., 2-3 months)",
      "topics": ["Topic 1", "Topic 2", "Topic 3"]
    }
  ],
  "skills_to_acquire": [
    "Skill 1",
    "Skill 2",
    "Skill 3",
    "Skill 4",
    "Skill 5"
  ],
  "certifications": [
    "Relevant certification 1",
    "Relevant certification 2"
  ],
  "recommended_resources": [
    {
      "title": "Resource name",
      "type": "Book/Course/Tutorial/Documentation",
      "url": "URL if available or 'Search online'",
      "description": "Brief description"
    }
  ],
  "job_search_tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3",
    "Tip 4"
  ],
  "salary_insights": {
    "entry": "Entry level salary range",
    "mid": "Mid level salary range",
    "senior": "Senior level salary range"
  },
  "milestones": [
    {
      "title": "Milestone name",
      "timeframe": "When to achieve this",
      "description": "What you should accomplish"
    }
  ]
}

Make the learning path specific to their experience level and time commitment. If they're a beginner, include more foundational topics. If they have more time, suggest more intensive learning. Tailor the learning style recommendations based on their preference.

Return ONLY valid JSON, no additional text.`;

    console.log('Generating learning path with OpenAI...');

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach specializing in creating personalized learning paths. You provide detailed, actionable guidance in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: OPENAI_MAX_TOKENS,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0].message.content.trim();

    // Parse the JSON response
    const learningPath = JSON.parse(responseText);

    return {
      success: true,
      data: {
        career_path,
        ...learningPath,
        generated_by: 'OpenAI',
        generated_at: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('OpenAI Error:', error.message);

    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return {
        success: false,
        error: 'OpenAI API quota exceeded. Please check your OpenAI account.',
        useFallback: true
      };
    }

    if (error.code === 'invalid_api_key') {
      return {
        success: false,
        error: 'Invalid OpenAI API key. Please check your configuration.',
        useFallback: true
      };
    }

    return {
      success: false,
      error: `Failed to generate learning path: ${error.message}`,
      useFallback: true
    };
  }
};

/**
 * Check if OpenAI is configured and working
 * @returns {Promise<Object>} Status of OpenAI service
 */
export const checkOpenAIStatus = async () => {
  if (!openai) {
    return {
      configured: false,
      working: false,
      message: 'OpenAI API key not configured'
    };
  }

  try {
    // Test the API with a simple request
    await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5
    });

    return {
      configured: true,
      working: true,
      model: OPENAI_MODEL,
      message: 'OpenAI service is operational'
    };
  } catch (error) {
    return {
      configured: true,
      working: false,
      message: `OpenAI service error: ${error.message}`
    };
  }
};
