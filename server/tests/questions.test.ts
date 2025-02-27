import request from 'supertest';
import express from 'express';
import router from '../controller/question';
import jwt from 'jsonwebtoken';
import { mockAuthMiddleware } from './test-functions/mockAuthMiddleware';
import { mockQuestions } from './test-data/questionObjects';
import { getQuestionsByOrder, filterQuestionsBySearch, getTagIds, upvoteQuestion, downvoteQuestion, fetchAndIncrementQuestionViewsById } from '../models/application';
import { IQuestion } from '../models/types/types';

jest.mock('../models/application');

const app = express();
app.use(express.json());
app.use('/', router);

const generateValidJWT = (userId: string = 'testId', username: string = 'testuser') => {
  return jwt.sign({ userId, username }, process.env.SECRET_KEY as string);
};


/**
 * Tests the question-related routes.
 *
 * This test suite verifies the functionality of various API endpoints related to
 * questions, including:
 *
 * - `GET /getQuestion`: Retrieves questions, optionally filtered by search terms and ordered.
 * - `POST /tag-ids`: Retrieves an array of tag IDs based on provided tag names.
 * - `POST /:questionId/upvote`: Upvotes a question.
 * - `POST /:questionId/downvote`: Downvotes a question.
 * - `GET /getQuestionById/:qid` : Gets a question using its questionId
 */
describe('Question Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /getQuestion', () => {
    it('should return the result of filterQuestionsBySearch as response even if request parameters of order and search are absent', async () => {
      (getQuestionsByOrder as jest.Mock).mockResolvedValue(mockQuestions);
      (filterQuestionsBySearch as jest.Mock).mockReturnValue(mockQuestions);

      const response = await request(app).get('/getQuestion');

      expect(response.status).toBe(200);

      response.body.forEach((question: IQuestion, index: number) => {
        expect(question._id).toEqual(mockQuestions[index]._id);
        expect(question.title).toEqual(mockQuestions[index].title);
        expect(question.text).toEqual(mockQuestions[index].text);
        expect(question.tags).toEqual(mockQuestions[index].tags);
        expect(question.asked_by).toEqual(mockQuestions[index].asked_by);
        expect(question.views).toEqual(mockQuestions[index].views);
        expect(question.votes).toEqual(mockQuestions[index].votes);

        if (question.answers.length > 0 && mockQuestions[index].answers.length > 0) {
          expect(question.answers[0]._id).toEqual(mockQuestions[index].answers[0]._id);
        }
      });

      expect(getQuestionsByOrder).toHaveBeenCalledWith('newest');
      expect(filterQuestionsBySearch).toHaveBeenCalledWith(mockQuestions, '');
    });
  });

  describe('POST /tag-ids', () => {
    it('should return an array of tag IDs for valid tag names', async () => {
      const tagNames = ['tag1', 'tag2', 'tag3'];
      const mockTagIds = ['id1', 'id2', 'id3'];

      (getTagIds as jest.Mock).mockResolvedValue(mockTagIds);

      const response = await request(app)
        .post('/tag-ids')
        .send({ tagNames });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTagIds);
      expect(getTagIds).toHaveBeenCalledWith(tagNames);
    });
  });

  describe('POST /:questionId/upvote', () => {
    it('should upvote a question successfully', async () => {
      app.use(mockAuthMiddleware);

      const questionId = '65e9b58910afe6e94fc6e6dc'; // Use a valid question ID
      const updatedQuestion = { ...mockQuestions[0], votes: ['testuser'] }; // Mock updated question

      (upvoteQuestion as jest.Mock).mockResolvedValue(updatedQuestion);

      const token = generateValidJWT();
      const response = await request(app)
        .post(`/${questionId}/upvote`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Upvoted successfully');
      expect(response.body.question.votes[0]).toEqual('testuser'); 
      expect(upvoteQuestion).toHaveBeenCalledWith(questionId, 'testuser');
    });

    it('should return 401 Unauthorized if no JWT is provided', async () => {
      const questionId = '65e9b58910afe6e94fc6e6dc';
      const response = await request(app)
        .post(`/${questionId}/upvote`); 

      expect(response.status).toBe(401);
    });

    it('should return 404 Not Found if question is not found', async () => {
      app.use(mockAuthMiddleware);

      const questionId = 'nonExistentQuestionId';
      (upvoteQuestion as jest.Mock).mockResolvedValue(null);

      const token = generateValidJWT();
      const response = await request(app)
        .post(`/${questionId}/upvote`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Question not found');
    });

    it('should return 500 Internal Server Error if upvoteQuestion throws an error', async () => {
      app.use(mockAuthMiddleware);

      const questionId = '65e9b58910afe6e94fc6e6dc';
      (upvoteQuestion as jest.Mock).mockRejectedValue(new Error('Database error'));

      const token = generateValidJWT();
      const response = await request(app)
        .post(`/${questionId}/upvote`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('POST /:questionId/downvote', () => {
    it('should downvote a question successfully', async () => {
      app.use(mockAuthMiddleware);

      const questionId = '65e9b5a995b6c7045a30d823'; 
      const updatedQuestion = { ...mockQuestions[1], votes: [] }; 
      (downvoteQuestion as jest.Mock).mockResolvedValue(updatedQuestion);

      const token = generateValidJWT();
      const response = await request(app)
        .post(`/${questionId}/downvote`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Downvoted successfully');


      expect(response.body.question.votes).toEqual(updatedQuestion.votes); 

      expect(downvoteQuestion).toHaveBeenCalledWith(questionId, 'testuser');
    });

    it('should return 401 Unauthorized if no JWT is provided', async () => {
      const questionId = '65e9b5a995b6c7045a30d823';
      const response = await request(app)
        .post(`/${questionId}/downvote`); 

      expect(response.status).toBe(401);
    });

    it('should return 404 Not Found if question is not found', async () => {
      app.use(mockAuthMiddleware);

      const questionId = 'nonExistentQuestionId';
      (downvoteQuestion as jest.Mock).mockResolvedValue(null);

      const token = generateValidJWT();
      const response = await request(app)
        .post(`/${questionId}/downvote`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Question not found');
    });

    it('should return 500 Internal Server Error if downvoteQuestion throws an error', async () => {
      app.use(mockAuthMiddleware);

      const questionId = '65e9b5a995b6c7045a30d823';
      (downvoteQuestion as jest.Mock).mockRejectedValue(new Error('Database error'));

      const token = generateValidJWT();
      const response = await request(app)
        .post(`/${questionId}/downvote`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('GET /getQuestionById/:qid', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return a question object with the specified ID', async () => {
      const questionId = '65e9b5a995b6c7045a30d823';
      const mockQuestion: IQuestion = { 
        _id: questionId,
        title: 'Question Title',
        text: 'Question Text',
        tags: [{ _id: 'someTagId', name: 'tag1' }],
        answers: [],
        asked_by: 'user1',
        ask_date_time: new Date('2024-01-01'), 
        views: 10, 
        votes: [] 
      };
  
      (fetchAndIncrementQuestionViewsById as jest.Mock).mockResolvedValue(mockQuestion);
  
      const response = await request(app)
        .get(`/getQuestionById/${questionId}`); 
  
      expect(response.status).toBe(200);
      expect(response.body._id).toEqual(mockQuestion._id);
      expect(response.body.title).toEqual(mockQuestion.title);
      expect(response.body.ask_date_time).toEqual(mockQuestion.ask_date_time.toISOString());
  
      expect(fetchAndIncrementQuestionViewsById).toHaveBeenCalledWith(questionId);
      expect(fetchAndIncrementQuestionViewsById).toHaveBeenCalledWith(questionId);
    });
  
    it('should return 500 Internal Server Error if database error occurs', async () => {
      const questionId = '65e9b5a995b6c7045a30d823';
  
      (fetchAndIncrementQuestionViewsById as jest.Mock).mockRejectedValue(new Error('Database error'));
  
      const response = await request(app)
        .get(`/getQuestionById/${questionId}`);
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error fetching questions' }); 
    });
  });
});