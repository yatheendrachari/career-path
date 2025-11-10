# Quick Fix for Signup Error

## Problem
Signup endpoint returns 500 error because MongoDB is not running.

## Quick Solution

### Step 1: Start MongoDB

**Option A: If MongoDB is installed locally**
```bash
# Windows
mongod

# Or if installed as Windows service:
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# or
mongod
```

**Option B: Use Docker (if you have Docker)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option C: Use MongoDB Atlas (Cloud - Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `backend-node/.env`:
   ```
   MONGODB_URI=  <mongodb+srv://username: example ...>
   ```

### Step 2: Restart Node.js Backend

After starting MongoDB, restart the backend:
```bash
cd backend-node
# Stop current server (Ctrl+C)
npm run dev
```

You should see: `MongoDB Connected: localhost`

### Step 3: Test Signup

Now try signing up again from the frontend. It should work!

## Verification

Check if MongoDB is running:
```bash
# Windows
Get-Process -Name mongod

# Linux/Mac
ps aux | grep mongod
```



