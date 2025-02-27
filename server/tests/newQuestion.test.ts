import request from 'supertest';
import express from 'express';
import router from '../controller/question';
import { saveQuestion } from '../models/application';
import { generateValidJWT, mockAuthMiddleware } from './test-functions/mockAuthMiddleware';
import { IQuestion } from '../models/types/types';
import xss from 'xss';
import { xssOptions } from '../util/xssOptions';

jest.mock('../models/application');

const app = express();
app.use(express.json());
app.use('/', router);

// Mock question object
const mockQuestion: IQuestion = {
  _id: "6561f081a3b4c034650e6543",
  title: 'Test Question',
  text: 'This is a test question',
  tags: [{ name: 'test' }],
  asked_by: 'testuser',
  ask_date_time: new Date(),
  answers: [],
  views: 0,
  votes: []
};

// Mock request body for adding a question
const mockQuestionReqBody = {
  title: 'Test Question',
  text: 'This is a test question',
  tags: [{ name: 'test' }],
  answers: [],
  views: 0,
  votes: []
};

/**
 * Tests the `POST /addQuestion` route.
 *
 * This test suite verifies the functionality of the API endpoint for adding new
 * questions. It covers various scenarios, including:
 *
 * - Successful addition of a question with all required fields.
 * - Handling of missing authentication or invalid JWT.
 * - Validation of required fields in the request body.
 * - Sanitization of input to prevent XSS attacks.
 * - Handling of database errors during question saving.
 */
describe('Question Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /addQuestion', () => {
    it('should add a new question when all required fields are provided', async () => {
      app.use(mockAuthMiddleware);

      (saveQuestion as jest.Mock).mockResolvedValue(mockQuestion);

      const token = generateValidJWT();
      const response = await request(app)
        .post('/addQuestion')
        .set('Authorization', `Bearer ${token}`)
        .send(mockQuestionReqBody);

      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
    });

    it('should return 401 Unauthorized if no JWT is provided', async () => {
      const response = await request(app)
        .post('/addQuestion')
        .send(mockQuestionReqBody);

      expect(response.status).toBe(401);
    });

    it('should return 403 Forbidden if an invalid JWT is provided', async () => {
      const invalidToken = 'invalid-jwt';
      const response = await request(app)
        .post('/addQuestion')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(mockQuestionReqBody);

      expect(response.status).toBe(403);
    });

    it('should return 400 Bad Request if required fields are missing', async () => {
      app.use(mockAuthMiddleware);
    
      const token = generateValidJWT();
      const response = await request(app)
        .post('/addQuestion')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Missing title, text, or tags should trigger issue
          answers: [], 
          views: 0 
        });
    
      expect(response.status).toBe(400);

    });
    it('should sanitize input to prevent XSS attacks', async () => {
      app.use(mockAuthMiddleware);

      (saveQuestion as jest.Mock).mockResolvedValue({});

      const token = generateValidJWT();
      const response = await request(app)
        .post('/addQuestion')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '<script>alert("XSS")</script>',
          text: 'This is a test question with <img src="x" onerror="alert(\'XSS\')">',
          tags: [{ name: '<script>alert("XSS")</script>' }],
          answers: [],
          views: 0
        });

      expect(response.status).toBe(200);

      const expectedTitle = xss('<script>alert("XSS")</script>', xssOptions);
      const expectedText = xss('This is a test question with <img src="x" onerror="alert(\'XSS\')">', xssOptions);
      const expectedTagName = xss('<script>alert("XSS")</script>', xssOptions);

      expect(saveQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expectedTitle,
          text: expectedText,
          tags: [{ name: expectedTagName }]
        })
      );
    });

    it('should return 500 Internal Server Error if database error occurs', async () => {
      app.use(mockAuthMiddleware);

      (saveQuestion as jest.Mock).mockRejectedValue(new Error('Database error'));

      const token = generateValidJWT();
      const response = await request(app)
        .post('/addQuestion')
        .set('Authorization', `Bearer ${token}`)
        .send(mockQuestionReqBody);

      expect(response.status).toBe(500);
      expect(response.body).toBe('Database error');
    });
  });
});