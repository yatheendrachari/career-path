import express from 'express';
import {
  generatePath,
  saveLearningPath,
  getLearningPathHistory,
  deleteLearningPath
} from '../controllers/learningPathController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public route (can generate without auth, but can't save)
router.post('/generate-path', generatePath);

// Protected routes
router.post('/save-learning-path', authenticate, saveLearningPath);
router.get('/learning-path-history', authenticate, getLearningPathHistory);
router.delete('/learning-path-history/:id', authenticate, deleteLearningPath);

export default router;

