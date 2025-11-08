import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/User.js';
import LearningPath from '../src/models/LearningPath.js';
import '../tests/setup.js';

describe('Learning Path Routes', () => {
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

  describe('POST /api/generate-path', () => {
    it('should generate learning path', async () => {
      const pathData = {
        career_path: 'Software Engineer',
        current_skills: ['Python', 'JavaScript'],
        experience_level: 'beginner',
        time_commitment: '10 hours/week',
        learning_style: 'online'
      };

      const response = await request(app)
        .post('/api/generate-path')
        .send(pathData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.career_path).toBe(pathData.career_path);
    });

    it('should not generate path with missing required fields', async () => {
      const response = await request(app)
        .post('/api/generate-path')
        .send({
          career_path: 'Software Engineer'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/save-learning-path', () => {
    it('should save learning path for authenticated user', async () => {
      const pathData = {
        career_path: 'Software Engineer',
        learning_path_data: {
          overview: 'Test overview',
          learning_phases: [
            {
              phase: 'Foundation',
              duration: '2-3 months',
              topics: ['Basics']
            }
          ],
          skills_to_acquire: ['Python'],
          certifications: [],
          job_search_tips: [],
          salary_insights: {}
        }
      };

      const response = await request(app)
        .post('/api/save-learning-path')
        .set('Authorization', `Bearer ${token}`)
        .send(pathData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.path_id).toBeDefined();
    });

    it('should not save learning path without authentication', async () => {
      const response = await request(app)
        .post('/api/save-learning-path')
        .send({})
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/learning-path-history', () => {
    it('should get learning path history for authenticated user', async () => {
      // Create a learning path
      await LearningPath.create({
        user: userId,
        career_path: 'Software Engineer',
        learning_path_data: {
          overview: 'Test',
          learning_phases: []
        },
        progress: 0
      });

      const response = await request(app)
        .get('/api/learning-path-history')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.paths).toBeDefined();
      expect(Array.isArray(response.body.paths)).toBe(true);
    });

    it('should not get learning path history without authentication', async () => {
      const response = await request(app)
        .get('/api/learning-path-history')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/learning-path-history/:id', () => {
    it('should delete learning path', async () => {
      const learningPath = await LearningPath.create({
        user: userId,
        career_path: 'Software Engineer',
        learning_path_data: {
          overview: 'Test',
          learning_phases: []
        },
        progress: 0
      });

      const response = await request(app)
        .delete(`/api/learning-path-history/${learningPath._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify it's deleted
      const deleted = await LearningPath.findById(learningPath._id);
      expect(deleted).toBeNull();
    });
  });
});

