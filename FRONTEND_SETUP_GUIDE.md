# 🚀 Career Path Recommendation System - Frontend Setup Guide

**Complete Step-by-Step Setup for Windows (PowerShell)**

This guide will help you set up a **React.js + Vite + TailwindCSS** frontend from scratch with zero errors.

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher) installed
- **npm** (comes with Node.js)
- **PowerShell** or **Windows Terminal**

Check versions:
```powershell
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

---

## 🧱 Step 1: Initialize the Vite Project

Open **PowerShell** and navigate to your project root:

```powershell
# Navigate to your project directory
cd C:\Users\kycha\Documents\Btech\4-1\career-path-ui\career_path_latest

# Create frontend folder
mkdir frontend
cd frontend

# Initialize Vite project with React template
npm create vite@latest . -- --template react

# When prompted, answer:
# - Project name: . (current directory)
# - Select framework: React
# - Select variant: JavaScript
```

**Alternative if the above doesn't work:**
```powershell
npm create vite@latest frontend -- --template react
cd frontend
```

---

## ⚙️ Step 2: Install Core Dependencies

Install all required packages:

```powershell
# Install main dependencies
npm install

# Install additional required packages
npm install react-router-dom axios

# Install TailwindCSS and related tools
npm install -D tailwindcss postcss autoprefixer
```

**Verify installation:**
```powershell
npm list react react-dom react-router-dom axios tailwindcss
```

---

## 🎨 Step 3: Set Up TailwindCSS

### 3.1 Initialize TailwindCSS

```powershell
npx tailwindcss init -p
```

This creates:
- `tailwind.config.js`
- `postcss.config.js`

### 3.2 Configure Tailwind to Scan JSX Files

Open `tailwind.config.js` and replace its content with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3.3 Add Tailwind Directives to CSS

Create or update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📁 Step 4: Create Project Structure

Create the required folder structure:

```powershell
# Create folders
New-Item -ItemType Directory -Path "src/pages" -Force
New-Item -ItemType Directory -Path "src/components" -Force
New-Item -ItemType Directory -Path "src/context" -Force
New-Item -ItemType Directory -Path "src/api" -Force

# Verify structure
tree /F src
```

**Expected structure:**
```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── /src
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── /pages
│   ├── /components
│   ├── /context
│   └── /api
```

---

## 🔧 Step 5: Configure Essential Files

### 5.1 Update `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
```

### 5.2 Create `src/api/axios.js` (Axios Configuration)

```powershell
New-Item -ItemType File -Path "src/api/axios.js" -Force
```

Add this content:

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 5.3 Create Environment File

```powershell
New-Item -ItemType File -Path ".env" -Force
```

Add this content:

```env
VITE_API_URL=http://localhost:8000
```

### 5.4 Update `src/main.jsx`

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 5.5 Update `src/App.jsx` (Basic Router Setup)

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CareerProvider } from './context/CareerContext';

// Import pages (we'll create these)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CareerPathPage from './pages/CareerPathPage';
import LearningPathPage from './pages/LearningPathPage';
import QuizPage from './pages/QuizPage';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CareerProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz"
                element={
                  <ProtectedRoute>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/career-path"
                element={
                  <ProtectedRoute>
                    <CareerPathPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learning-path"
                element={
                  <ProtectedRoute>
                    <LearningPathPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </CareerProvider>
    </AuthProvider>
  );
}

export default App;
```

### 5.6 Update `package.json` Scripts

Ensure your `package.json` has these scripts:

```json
{
  "name": "career-path-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.0"
  }
}
```

---

## 🚀 Step 6: Run the Dev Server

Start the development server:

```powershell
npm run dev
```

**Expected output:**
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

Open browser and navigate to: **http://localhost:5173/**

---

## 🧯 Common Error Fixes

### ❌ Error: "vite is not recognized"

**Cause:** Vite not installed or npm scripts not configured.

**Fix:**
```powershell
# Reinstall dependencies
npm install

# Run with npx if needed
npx vite

# Or ensure package.json has "dev": "vite" in scripts
```

---

### ❌ Error: "Missing script: dev"

**Cause:** `package.json` doesn't have the dev script.

**Fix:**
Open `package.json` and ensure:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

Then run:
```powershell
npm run dev
```

---

### ❌ Error: "index.html not found"

**Cause:** `index.html` is missing or in wrong location.

**Fix:**
Ensure `index.html` exists in the **root of frontend folder** (not in `src/`):

```powershell
# Check if file exists
Test-Path "index.html"

# If false, create it
New-Item -ItemType File -Path "index.html" -Force
```

Add this content:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Career Path Finder</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### ❌ Error: "Cannot find module './App.jsx'"

**Cause:** `App.jsx` or `main.jsx` missing.

**Fix:**
```powershell
# Verify files exist
Test-Path "src/main.jsx"
Test-Path "src/App.jsx"

# If missing, recreate them (see Step 5.4 and 5.5 above)
```

---

### ❌ Error: "Failed to resolve import"

**Cause:** Missing dependencies or incorrect import paths.

**Fix:**
```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### ❌ Error: "Port 5173 already in use"

**Fix:**
```powershell
# Find and kill process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in vite.config.js
```

---

### ❌ Error: "Tailwind classes not working"

**Cause:** TailwindCSS not configured properly.

**Fix:**
1. Verify `tailwind.config.js` content (see Step 3.2)
2. Verify `src/index.css` has Tailwind directives (see Step 3.3)
3. Ensure `index.css` is imported in `main.jsx`
4. Restart dev server: `npm run dev`

---

### ❌ Nuclear Option: Complete Reset

If nothing works, start fresh:

```powershell
# Stop dev server (Ctrl+C)

# Delete everything
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install

# Clear cache
npm cache clean --force

# Restart
npm run dev
```

---

## 🔍 Verification Checklist

Before running, verify:

- [ ] `index.html` exists in frontend root
- [ ] `src/main.jsx` exists
- [ ] `src/App.jsx` exists
- [ ] `src/index.css` has Tailwind directives
- [ ] `tailwind.config.js` configured
- [ ] `package.json` has "dev": "vite" script
- [ ] `node_modules` folder exists
- [ ] Port 5173 is free

Run verification:
```powershell
# Check all files
Test-Path "index.html"
Test-Path "src/main.jsx"
Test-Path "src/App.jsx"
Test-Path "tailwind.config.js"

# List npm scripts
npm run
```

---

## 📦 Final Project Structure

```
frontend/
├── .env
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── /node_modules
├── /public
└── /src
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── /api
    │   └── axios.js
    ├── /components
    │   ├── ProtectedRoute.js
    │   ├── Navbar.js
    │   ├── CareerCard.jsx
    │   ├── CareerForm.jsx
    │   ├── LearningPathCard.jsx
    │   ├── QuizGenerator.jsx
    │   ├── ErrorAlert.jsx
    │   ├── LoadingSpinner.jsx
    │   └── DashboardCard.jsx
    ├── /context
    │   ├── AuthContext.js
    │   └── CareerContext.js
    └── /pages
        ├── HomePage.jsx
        ├── LoginPage.jsx
        ├── DashboardPage.jsx
        ├── QuizPage.jsx
        ├── CareerPathPage.jsx
        └── LearningPathPage.jsx
```

---

## 🎯 Quick Start Commands

```powershell
# Navigate to frontend folder
cd C:\Users\kycha\Documents\Btech\4-1\career-path-ui\career_path_latest\frontend

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev

# In a new terminal, start backend
cd ..\backend
python -m uvicorn main:app --reload
```

---

## 🌐 Testing the Setup

1. **Frontend:** http://localhost:5173/
2. **Backend:** http://localhost:8000/
3. **Backend Docs:** http://localhost:8000/docs

---

## 🔗 Connecting Frontend to Backend

All API calls should use the configured axios instance:

```javascript
import api from '../api/axios';

// Example: Fetch careers
const response = await api.get('/careers');

// Example: Login
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

---

## 📝 Next Steps

1. ✅ Complete frontend setup
2. ✅ Create Context files (AuthContext.js, CareerContext.js)
3. ✅ Create Component files (all components listed above)
4. ✅ Create Page files (all pages listed above)
5. 🔄 Test integration with backend
6. 🎨 Customize styling with TailwindCSS

---

## 💡 Pro Tips

- **Hot Reload:** Vite automatically reloads on file changes
- **TailwindCSS IntelliSense:** Install VS Code extension for autocomplete
- **React DevTools:** Install browser extension for debugging
- **Console Errors:** Always check browser console (F12) for errors
- **Network Tab:** Monitor API calls in browser DevTools

---

## 🆘 Getting Help

If you encounter issues:

1. Check browser console (F12) for errors
2. Check terminal for build errors
3. Verify all files exist and are in correct locations
4. Try the "Nuclear Option" reset
5. Ensure backend is running on port 8000

---

**🎉 You're all set! Your frontend should now be running on http://localhost:5173/**
