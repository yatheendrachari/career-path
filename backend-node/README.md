# Career Path Backend API

Node.js backend for the Career Path Recommendation System.

## Features

- RESTful API with Express.js
- MongoDB database with Mongoose
- JWT authentication
- Career prediction integration with Python ML service
- Learning path generation
- User dashboard with stats
- Comprehensive unit tests

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Python ML service running on port 8000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- MongoDB connection string
- JWT secret
- Python ML service URL

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Careers
- `GET /api/careers` - Get list of available careers
- `POST /api/predict` - Predict career path (optional auth)
- `GET /api/career-history` - Get career history (protected)
- `DELETE /api/career-history/:id` - Delete career history (protected)

### Learning Paths
- `POST /api/generate-path` - Generate learning path
- `POST /api/save-learning-path` - Save learning path (protected)
- `GET /api/learning-path-history` - Get learning path history (protected)
- `DELETE /api/learning-path-history/:id` - Delete learning path (protected)

### Dashboard
- `GET /api/dashboard` - Get dashboard data (protected)

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Environment Variables

See `.env.example` for all required environment variables.

