import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import learningPathRoutes from './routes/learningPathRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173'||'http://localhost:5174',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', careerRoutes);
app.use('/api', learningPathRoutes);
app.use('/api', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Career Path Recommendation API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      careers: '/api/careers',
      predict: '/api/predict',
      learningPath: '/api/generate-path',
      dashboard: '/api/dashboard'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}`);
});

export default app;

