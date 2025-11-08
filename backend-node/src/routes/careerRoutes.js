import express from 'express';
import {
  getCareersList,
  predictCareerPath,
  getCareerHistory,
  deleteCareerHistory
} from '../controllers/careerController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/careers', getCareersList);

// Routes that work with or without authentication
router.post('/predict', optionalAuth, predictCareerPath);

// Protected routes
router.get('/career-history', authenticate, getCareerHistory);
router.delete('/career-history/:id', authenticate, deleteCareerHistory);

export default router;

