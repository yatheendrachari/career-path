import express from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected route
router.get('/dashboard', authenticate, getDashboard);

export default router;

