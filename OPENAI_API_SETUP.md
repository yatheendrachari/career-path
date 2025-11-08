# OpenAI Learning Path API Setup Guide

## Overview

The Career Path application now integrates with OpenAI's GPT-4 to generate personalized, AI-powered learning paths. The system automatically falls back to a local algorithm if OpenAI is not configured or encounters issues.

## Features

- **AI-Powered Learning Paths**: Uses OpenAI GPT-4o-mini to generate comprehensive, personalized learning paths
- **Automatic Fallback**: If OpenAI is unavailable or not configured, the system uses a local algorithm
- **Detailed Guidance**: Includes learning phases, milestones, resources, certifications, and salary insights
- **Personalization**: Tailored to experience level, time commitment, and learning style

## Setup Instructions

### 1. Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy your API key (starts with `sk-`)

### 2. Configure the Backend

Edit the `.env` file in the `backend-node` directory:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=2000
```

**Configuration Options:**

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: The model to use (default: `gpt-4o-mini`)
  - Recommended: `gpt-4o-mini` (cost-effective, fast)
  - Alternative: `gpt-4o` (more capable, more expensive)
- `OPENAI_MAX_TOKENS`: Maximum tokens for response (default: 2000)

### 3. Restart the Backend

After updating the `.env` file:

```bash
cd backend-node
npm start
```

The backend will automatically detect the OpenAI configuration and use it for learning path generation.

## API Endpoint

### POST `/api/generate-path`

Generates a personalized learning path using OpenAI.

**Request Body:**

```json
{
  "career_path": "Software Engineer",
  "current_skills": ["JavaScript", "React", "Node.js"],
  "experience_level": "intermediate",
  "time_commitment": "10",
  "learning_style": "online"
}
```

**Parameters:**

- `career_path` (string, required): Target career goal
- `current_skills` (array or string, required): Current skills/knowledge
- `experience_level` (string, required): One of: `beginner`, `intermediate`, `advanced`
- `time_commitment` (string/number, required): Hours per week available for learning
- `learning_style` (string, optional): Learning preference (default: `online`)

**Response (Success):**

```json
{
  "success": true,
  "career_path": "Software Engineer",
  "overview": "A comprehensive learning path...",
  "learning_phases": [
    {
      "phase": "Foundation",
      "duration": "2-3 months",
      "topics": ["Topic 1", "Topic 2", "Topic 3"]
    }
  ],
  "skills_to_acquire": [
    "Advanced JavaScript",
    "System Design",
    "Testing",
    "CI/CD",
    "Cloud Services"
  ],
  "certifications": [
    "AWS Certified Developer",
    "Professional Scrum Master"
  ],
  "recommended_resources": [
    {
      "title": "You Don't Know JS",
      "type": "Book",
      "url": "https://github.com/getify/You-Dont-Know-JS",
      "description": "Deep dive into JavaScript mechanics"
    }
  ],
  "job_search_tips": [
    "Build a strong GitHub profile",
    "Contribute to open source",
    "Network with professionals",
    "Prepare for technical interviews"
  ],
  "salary_insights": {
    "entry": "$60,000 - $80,000",
    "mid": "$80,000 - $120,000",
    "senior": "$120,000 - $180,000+"
  },
  "milestones": [
    {
      "title": "Complete Foundation",
      "timeframe": "Month 1-3",
      "description": "Master core concepts and build 3 projects"
    }
  ],
  "generated_by": "OpenAI",
  "generated_at": "2024-01-15T10:30:00.000Z"
}
```

**Response (Fallback):**

If OpenAI is not configured or fails, the API automatically uses a local algorithm and still returns a valid learning path (without `generated_by` and `recommended_resources` fields).

## Frontend Integration

The frontend automatically calls this API when users submit the learning path form:

```javascript
// From: frontend/src/pages/LearningPathPage.jsx

const response = await axios.post(`${API_BASE_URL}/generate-path`, {
  career_path: formData.career_path,
  current_skills: formData.current_skills,
  experience_level: formData.experience_level,
  time_commitment: formData.time_commitment,
  learning_style: formData.learning_style
});

const learningPathData = response.data;
```

No changes are required to the frontend - it works seamlessly with both OpenAI-generated and fallback learning paths.

## Cost Considerations

### OpenAI Pricing (as of 2024)

- **GPT-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **GPT-4o**: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens

### Estimated Costs Per Request

With typical learning path requests (~1,000 input tokens, ~1,500 output tokens):

- **GPT-4o-mini**: ~$0.001 per request (highly recommended)
- **GPT-4o**: ~$0.015 per request

For 1,000 learning paths per month:
- GPT-4o-mini: ~$1/month
- GPT-4o: ~$15/month

## Troubleshooting

### OpenAI Not Working

1. **Check API Key**: Ensure your API key is correct and active
2. **Check Quota**: Verify you have credits in your OpenAI account
3. **View Logs**: Check backend console for error messages
4. **Fallback Active**: The system will automatically use fallback algorithm

### Error Messages

- `"OpenAI API key not configured"`: Add your API key to `.env`
- `"OpenAI API quota exceeded"`: Add credits to your OpenAI account
- `"Invalid OpenAI API key"`: Check that your API key is correct

### Testing

Test the API endpoint directly:

```bash
curl -X POST http://localhost:3000/api/generate-path \
  -H "Content-Type: application/json" \
  -d '{
    "career_path": "Data Scientist",
    "current_skills": ["Python", "Statistics"],
    "experience_level": "beginner",
    "time_commitment": "15",
    "learning_style": "online"
  }'
```

## Benefits of OpenAI Integration

1. **Personalized Content**: AI generates custom learning paths based on individual needs
2. **Up-to-Date Information**: OpenAI's knowledge includes recent industry trends
3. **Detailed Resources**: Specific book, course, and tutorial recommendations
4. **Realistic Milestones**: Achievable goals based on time commitment
5. **Industry Insights**: Current salary ranges and job market information

## Fallback Mechanism

If OpenAI is unavailable, the system uses a rule-based algorithm that:
- Maps skills and interests to career paths
- Generates learning phases based on experience level
- Provides generic but useful recommendations
- Ensures the application always works

## Security Notes

- **Never commit** your `.env` file with the actual API key to version control
- The `.env` file is already in `.gitignore`
- Rotate your API key periodically
- Monitor your OpenAI usage dashboard regularly

## Next Steps

1. Get your OpenAI API key
2. Add it to `backend-node/.env`
3. Restart the backend
4. Test the learning path generation feature
5. Monitor usage and costs in OpenAI dashboard

For more information:
- [OpenAI Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [API Reference](https://platform.openai.com/docs/api-reference)
