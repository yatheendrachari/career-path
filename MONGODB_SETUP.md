# MongoDB Setup Guide

## Issue
The signup endpoint is returning a 500 error because MongoDB is not running.

## Solution

### Option 1: Install and Start MongoDB Locally

1. **Install MongoDB** (if not already installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Or use package manager:
     - Windows: `choco install mongodb`
     - Mac: `brew install mongodb-community`
     - Linux: `sudo apt-get install mongodb`

2. **Start MongoDB**:
   ```bash
   # Windows
   mongod
   
   # Or if installed as a service:
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   # or
   mongod
   ```

3. **Verify MongoDB is running**:
   ```bash
   # Check if process is running
   # Windows: Check Task Manager for mongod.exe
   # Linux/Mac: ps aux | grep mongod
   ```

### Option 2: Use MongoDB Atlas (Cloud)

1. **Create a free account** at https://www.mongodb.com/cloud/atlas
2. **Create a cluster** (free tier available)
3. **Get connection string** from Atlas dashboard
4. **Update `.env` file** in `backend-node`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/career_path_db
   ```

### Option 3: Use Docker (if Docker is installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## After Starting MongoDB

1. **Restart the Node.js backend** (if it was already running):
   ```bash
   cd backend-node
   npm run dev
   ```

2. **Test the signup endpoint**:
   - The signup should now work
   - You should see "MongoDB Connected" in the backend logs

## Verification

Once MongoDB is running, you should see in the backend logs:
```
MongoDB Connected: localhost
```

And the signup endpoint should return:
```json
{
  "success": true,
  "message": "User registered successfully",
  "access_token": "...",
  "user": {...}
}
```

## Current Status

- ✅ Backend code updated with better error handling
- ✅ Database connection check added
- ⚠️ MongoDB needs to be started

