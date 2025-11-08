import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/User.js';
import CareerHistory from '../src/models/CareerHistory.js';
import LearningPath from '../src/models/LearningPath.js';
import UserStats from '../src/models/UserStats.js';
import '../tests/setup.js';

describe('Dashboard Routes', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123456'
      });
    
    token = signupResponse.body.access_token;
    userId = signupResponse.body.user.id;
  });

  describe('GET /api/dashboard', () => {
    it('should get dashboard data for authenticated user', async () => {
      // Create some test data
      await CareerHistory.create({
        user: userId,
        career_path: 'Software Engineer',
        confidence: 0.85,
        alternative_careers: [],
        input_data: {}
      });

      await LearningPath.create({
        user: userId,
        career_path: 'Software Engineer',
        learning_path_data: {
          overview: 'Test',
          learning_phases: []
        },
        progress: 50
      });

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user_info).toBeDefined();
      expect(response.body.career_history).toBeDefined();
      expect(response.body.learning_paths).toBeDefined();
      expect(response.body.stats).toBeDefined();
    });

    it('should not get dashboard without authentication', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

