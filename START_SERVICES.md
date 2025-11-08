# How to Start All Services

## Current Status

✅ **Frontend**: Running on http://localhost:5173
✅ **Node.js Backend**: Running on http://localhost:3000
⚠️ **MongoDB**: Not running (required for authentication and data storage)
⚠️ **Python ML Service**: Not running (optional, backend has fallback)

## Quick Start Commands

### 1. Start MongoDB (Required)
```bash
# Windows - if MongoDB is installed as a service, it should start automatically
# Or start manually:
mongod --dbpath "C:\data\db"

# Linux/Mac
sudo systemctl start mongod
# or
mongod
```

### 2. Start Node.js Backend
```bash
cd backend-node
npm run dev
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. (Optional) Start Python ML Service
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

## Testing the Website

1. **Open Frontend**: http://localhost:5173
2. **Test API**: http://localhost:3000/health
3. **Test Careers Endpoint**: http://localhost:3000/api/careers

## Common Issues

### MongoDB Connection Error
- **Problem**: Signup/Login endpoints timeout
- **Solution**: Start MongoDB service
- **Check**: `mongod --version` to verify MongoDB is installed

### Python ML Service Not Running
- **Problem**: Career predictions may fail
- **Solution**: Start Python backend or use fallback responses
- **Note**: Node.js backend has fallback logic for when Python service is unavailable

### Port Already in Use
- **Problem**: "Port 3000/5173/8000 already in use"
- **Solution**: 
  - Kill the process using the port
  - Or change the port in .env files

## Environment Variables

### Node.js Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/career_path_db
JWT_SECRET=career-path-super-secret-jwt-key-2024
PYTHON_ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## Testing Endpoints

### Health Check
```bash
curl http://localhost:3000/health
```

### Get Careers
```bash
curl http://localhost:3000/api/careers
```

### Signup (requires MongoDB)
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123456"}'
```

## Next Steps

1. **Start MongoDB** to enable full functionality
2. **Test user registration** at http://localhost:5173/signup
3. **Test career prediction** at http://localhost:5173/career-path
4. **Test dashboard** after logging in

