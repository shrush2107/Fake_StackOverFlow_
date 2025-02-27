import request from 'supertest';
import express from 'express';
import router from '../controller/answer';
import { updateAnswer, deleteAnswer, removeAnswerFromQuestion } from '../models/application';
import { IAnswer } from '../models/types/types';
import { generateValidJWT, mockAuthMiddleware } from './test-functions/mockAuthMiddleware';
import { xssOptions } from '../util/xssOptions';
import xss from 'xss';

jest.mock('../models/application');

const app = express();
app.use(express.json());
app.use('/', router);

// Mock answer object
const mockAnswer: IAnswer = {
  _id: "dummyAnswerId",
  text: "This is a test answer",
  ans_by: "testuser",
  ans_date_time: new Date('2024-06-03T12:00:00Z'),
};

/**
 * Tests answer-related routes.
 *
 * This test suite verifies the functionality of various API endpoints related to
 * answers, including:
 *
 * - `POST /updateAnswer`: Updates an existing answer.
 * - `POST /deleteAnswer`: Deletes an answer.
 * 
 * The tests verify the following aspects:
 * - Successful responses and data updates
 * - Error handling and appropriate status codes (400, 401, 403, 404, 500)
 * - Authentication and authorization using JWT
 * - Correct interaction with the application model functions
 */
describe('Answer Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /updateAnswer', () => {
    it('should update an answer successfully', async () => {
      app.use(mockAuthMiddleware);

      const updatedText = 'This is the updated answer text';
      const mockReqBody = {
        aid: mockAnswer._id,
        text: updatedText
      };

      (updateAnswer as jest.Mock).mockResolvedValue({ ...mockAnswer, text: updatedText });

      const token = generateValidJWT();
      const response = await request(app)
        .post('/updateAnswer')
        .set('Authorization', `Bearer ${token}`)
        .send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body.text).toBe(updatedText);

      expect(updateAnswer).toHaveBeenCalledWith(mockAnswer._id, updatedText, 'testuser');
    });
    
    it('should sanitize input to prevent XSS attacks', async () => {
      app.use(mockAuthMiddleware);
  
      const xssText = '<script>alert("XSS")</script>'; 
      const mockReqBody = {
        aid: mockAnswer._id,
        text: xssText 
      };
  
      const expectedText = xss(xssText, xssOptions); 
  
      (updateAnswer as jest.Mock).mockResolvedValue({ ...mockAnswer, text: expectedText });
  
      const token = generateValidJWT();
      const response = await request(app)
        .post('/updateAnswer')
        .set('Authorization', `Bearer ${token}`)
        .send(mockReqBody);
  
      expect(response.status).toBe(200);

      // confirms that update answer was called with xss attack text
      expect(updateAnswer).toHaveBeenCalledWith(mockAnswer._id, xssText, 'testuser');

      // checks that response is a sanitized version of xss attack text
      expect(response.body.text).toBe(expectedText);
    });
    
    it('should return 401 Unauthorized if no JWT is provided', async () => {
      const updatedText = 'This is the updated answer text';
      const mockReqBody = {
        aid: mockAnswer._id,
        text: updatedText
      };

      const response = await request(app)
        .post('/updateAnswer')
        .send(mockReqBody);

      expect(response.status).toBe(401);
    });

    it('should return 403 Forbidden if an invalid JWT is provided', async () => {
      app.use(mockAuthMiddleware);

      const updatedText = 'This is the updated answer text';
      const mockReqBody = {
        aid: mockAnswer._id,
        text: updatedText
      };

      const invalidToken = 'invalid-jwt';
      const response = await request(app)
        .post('/updateAnswer')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(mockReqBody);

      expect(response.status).toBe(403);
    });

    it('should return 400 Bad Request if required fields are missing', async () => {
      app.use(mockAuthMiddleware);

      const token = generateValidJWT();
      const response = await request(app)
        .post('/updateAnswer')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          // Missing aid or text
          text: 'This is the updated answer text' 
        });

      expect(response.status).toBe(400);
    });

    it('should return 404 Not Found if updateAnswer returns an error', async () => {
      app.use(mockAuthMiddleware);

      const updatedText = 'This is the updated answer text';
      const mockReqBody = {
        aid: mockAnswer._id,
        text: updatedText
      };

      (updateAnswer as jest.Mock).mockResolvedValue({ error: 'Answer not found', status: 404 });

      const token = generateValidJWT();
      const response = await request(app)
        .post('/updateAnswer')
        .set('Authorization', `Bearer ${token}`)
        .send(mockReqBody);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Answer not found');
    });

    it('should return 500 Internal Server Error if updateAnswer throws an error', async () => {
      app.use(mockAuthMiddleware);

      const updatedText = 'This is the updated answer text';
      const mockReqBody = {
        aid: mockAnswer._id,
        text: updatedText
      };

      (updateAnswer as jest.Mock).mockRejectedValue(new Error('Database error'));

      const token = generateValidJWT();
      const response = await request(app)
        .post('/updateAnswer')
        .set('Authorization', `Bearer ${token}`)
        .send(mockReqBody);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /deleteAnswer', () => {
    it('should delete an answer successfully', async () => {
      app.use(mockAuthMiddleware);

      const mockReqBody = {
        aid: mockAnswer._id,
        qid: 'someQuestionId'
      };

      (deleteAnswer as jest.Mock).mockResolvedValue({ success: true });
      (removeAnswerFromQuestion as jest.Mock).mockResolvedValue(undefined);

      const token = generateValidJWT();
      const response = await request(app)
        .post('/deleteAnswer')
        .set('Authorization', `Bearer ${token}`)
        .send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Answer deleted successfully');

      expect(deleteAnswer).toHaveBeenCalledWith(mockAnswer._id, 'testuser');
      expect(removeAnswerFromQuestion).toHaveBeenCalledWith('someQuestionId', mockAnswer._id);
    });

    it('should return 401 Unauthorized if no JWT is provided', async () => {
        const mockReqBody = {
          aid: mockAnswer._id,
          qid: 'someQuestionId'
        };
  
        const response = await request(app)
          .post('/deleteAnswer')
          .send(mockReqBody); // No Authorization header
  
        expect(response.status).toBe(401);
      });
  
      it('should return 403 Forbidden if an invalid JWT is provided', async () => {
        app.use(mockAuthMiddleware);
  
        const mockReqBody = {
          aid: mockAnswer._id,
          qid: 'someQuestionId'
        };
  
        const invalidToken = 'invalid-jwt';
        const response = await request(app)
          .post('/deleteAnswer')
          .set('Authorization', `Bearer ${invalidToken}`)
          .send(mockReqBody);
  
        expect(response.status).toBe(403);
      });
  
      it('should return 400 Bad Request if required fields are missing', async () => {
        app.use(mockAuthMiddleware);
  
        const token = generateValidJWT();
        const response = await request(app)
          .post('/deleteAnswer')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            // Missing aid or qid
            qid: 'someQuestionId' 
          });
  
        expect(response.status).toBe(400);
      });
  
      it('should return 404 Not Found if deleteAnswer returns an error', async () => {
        app.use(mockAuthMiddleware);
  
        const mockReqBody = {
          aid: mockAnswer._id,
          qid: 'someQuestionId'
        };
  
        (deleteAnswer as jest.Mock).mockResolvedValue({ error: 'Answer not found', status: 404 });
  
        const token = generateValidJWT();
        const response = await request(app)
          .post('/deleteAnswer')
          .set('Authorization', `Bearer ${token}`)
          .send(mockReqBody);
  
        expect(response.status).toBe(404);
        expect(response.text).toBe('Answer not found');
      });
  
      it('should return 500 Internal Server Error if deleteAnswer throws an error', async () => {
        app.use(mockAuthMiddleware);
  
        const mockReqBody = {
          aid: mockAnswer._id,
          qid: 'someQuestionId'
        };
  
        (deleteAnswer as jest.Mock).mockRejectedValue(new Error('Database error'));
  
        const token = generateValidJWT();
        const response = await request(app)
          .post('/deleteAnswer')
          .set('Authorization', `Bearer ${token}`)
          .send(mockReqBody);
  
        expect(response.status).toBe(500);
      });
    });
  });
