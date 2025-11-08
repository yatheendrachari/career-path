# Node.js Backend Setup Guide

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Create .env file**
Copy `.env.example` to `.env` and update with your values:
```bash
cp .env.example .env
```

3. **Start MongoDB**
Make sure MongoDB is running on your system.

4. **Start the Server**
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

Create a `.env` file in the `backend-node` directory with:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/career_path_db
MONGODB_TEST_URI=mongodb://localhost:27017/career_path_test_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Python ML Service
PYTHON_ML_SERVICE_URL=http://localhost:8000
PYTHON_ML_SERVICE_TIMEOUT=30000

# CORS
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires Bearer token)

### Career Endpoints

- `GET /api/careers` - Get list of available careers
- `POST /api/predict` - Predict career path
  ```json
  {
    "education": "Bachelor",
    "years_experience": 3,
    "skills": ["Python", "JavaScript"],
    "interests": ["Web Development"],
    "preferred_industry": "Technology"
  }
  ```
- `GET /api/career-history` - Get career history (requires auth)
- `DELETE /api/career-history/:id` - Delete career history (requires auth)

### Learning Path Endpoints

- `POST /api/generate-path` - Generate learning path
- `POST /api/save-learning-path` - Save learning path (requires auth)
- `GET /api/learning-path-history` - Get learning path history (requires auth)
- `DELETE /api/learning-path-history/:id` - Delete learning path (requires auth)

### Dashboard Endpoint

- `GET /api/dashboard` - Get dashboard data (requires auth)

## Project Structure

```
backend-node/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── services/       # Business logic services
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
├── tests/              # Test files
├── .env.example        # Environment variables example
├── package.json        # Dependencies
└── README.md           # Documentation
```

## Database Models

- **User** - User accounts and authentication
- **CareerHistory** - Career prediction history
- **LearningPath** - Learning path data
- **UserStats** - User statistics and activity tracking

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Error handling

## Integration with Python ML Service

The Node.js backend calls the Python ML service for:
- Career predictions (`/predict`)
- Getting available careers (`/careers`)

If the Python service is unavailable, the backend will return appropriate error messages.

