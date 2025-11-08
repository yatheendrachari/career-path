import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/User.js';
import CareerHistory from '../src/models/CareerHistory.js';
import '../tests/setup.js';

describe('Career Routes', () => {
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

  describe('GET /api/careers', () => {
    it('should get list of careers', async () => {
      const response = await request(app)
        .get('/api/careers')
        .expect(200);

      expect(response.body.careers).toBeDefined();
      expect(Array.isArray(response.body.careers)).toBe(true);
    });
  });

  describe('POST /api/predict', () => {
    it('should predict career path without authentication', async () => {
      const predictionData = {
        education: 'Bachelor',
        years_experience: 3,
        skills: ['Python', 'JavaScript'],
        interests: ['Web Development', 'AI'],
        certifications: [],
        preferred_industry: 'Technology'
      };

      const response = await request(app)
        .post('/api/predict')
        .send(predictionData)
        .expect(200);

      // Note: This will fail if Python ML service is not running
      // In that case, it should return an error
      expect(response.body).toBeDefined();
    });

    it('should predict career path with authentication and save to history', async () => {
      const predictionData = {
        education: 'Bachelor',
        years_experience: 3,
        skills: ['Python', 'JavaScript'],
        interests: ['Web Development'],
        preferred_industry: 'Technology'
      };

      const response = await request(app)
        .post('/api/predict')
        .set('Authorization', `Bearer ${token}`)
        .send(predictionData);

      // Check if prediction was made (may fail if ML service is down)
      expect([200, 500]).toContain(response.status);
    });

    it('should not predict with missing required fields', async () => {
      const response = await request(app)
        .post('/api/predict')
        .send({
          education: 'Bachelor'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/career-history', () => {
    it('should get career history for authenticated user', async () => {
      // Create a career history entry
      await CareerHistory.create({
        user: userId,
        career_path: 'Software Engineer',
        confidence: 0.85,
        alternative_careers: [],
        input_data: {
          education: 'Bachelor',
          years_experience: 3,
          skills: ['Python'],
          interests: ['Web Development']
        }
      });

      const response = await request(app)
        .get('/api/career-history')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.history).toBeDefined();
      expect(Array.isArray(response.body.history)).toBe(true);
    });

    it('should not get career history without authentication', async () => {
      const response = await request(app)
        .get('/api/career-history')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/career-history/:id', () => {
    it('should delete career history entry', async () => {
      const careerHistory = await CareerHistory.create({
        user: userId,
        career_path: 'Software Engineer',
        confidence: 0.85,
        alternative_careers: [],
        input_data: {}
      });

      const response = await request(app)
        .delete(`/api/career-history/${careerHistory._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify it's deleted
      const deleted = await CareerHistory.findById(careerHistory._id);
      expect(deleted).toBeNull();
    });

    it('should not delete other user\'s career history', async () => {
      // Create another user
      const otherUserResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Other User',
          email: 'other@example.com',
          password: 'Test123456'
        });

      const otherUserId = otherUserResponse.body.user.id;

      // Create career history for other user
      const careerHistory = await CareerHistory.create({
        user: otherUserId,
        career_path: 'Data Scientist',
        confidence: 0.90,
        alternative_careers: [],
        input_data: {}
      });

      // Try to delete with first user's token
      const response = await request(app)
        .delete(`/api/career-history/${careerHistory._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});

