# Integration Guide

## Architecture Overview

The application consists of three main components:

1. **Frontend (React)** - Port 5173
2. **Node.js Backend API** - Port 3000
3. **Python ML Service** - Port 8000

## Data Flow

```
Frontend (5173) → Node.js API (3000) → Python ML Service (8000)
```

The Node.js backend acts as a middleware that:
- Handles authentication and user management
- Stores data in MongoDB
- Calls Python ML service for predictions
- Returns formatted responses to frontend

## Setup Instructions

### 1. Start MongoDB

Make sure MongoDB is running:
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

### 2. Start Python ML Service

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### 3. Start Node.js Backend

```bash
cd backend-node
npm install
npm run dev
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Node.js Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/career_path_db
JWT_SECRET=your-secret-key
PYTHON_ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## API Endpoints

All endpoints are prefixed with `/api`:

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/careers` - Get careers list
- `POST /api/predict` - Predict career (optional auth)
- `GET /api/career-history` - Get career history (protected)
- `POST /api/generate-path` - Generate learning path
- `GET /api/dashboard` - Get dashboard data (protected)

## Testing

Run backend tests:
```bash
cd backend-node
npm test
```

## Troubleshooting

1. **CORS errors**: Make sure CORS_ORIGIN in backend .env matches frontend URL
2. **MongoDB connection**: Verify MongoDB is running and connection string is correct
3. **Python ML service**: Ensure Python backend is running on port 8000
4. **Port conflicts**: Check if ports 3000, 5173, and 8000 are available

