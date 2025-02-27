import request from 'supertest';
import express from 'express';
import router from '../controller/answer';
import { generateValidJWT, mockAuthMiddleware } from './test-functions/mockAuthMiddleware';
import { saveAnswer, addAnswerToQuestion } from '../models/application';
import { IAnswer } from '../models/types/types';
import { xssOptions } from '../util/xssOptions';
import xss from 'xss';

jest.mock('../models/application');

const app = express();
app.use(express.json());
app.use('/', router);

const mockReqBody = {
  qid: "dummyQuestionId",
  ans: {
    text: "This is a test answer",
    ans_by: "testuser",
    ans_date_time: new Date('2024-06-03T12:00:00Z'), // will be overwritten on save
  }
};

const mockReqXSSBody = {
  qid: "dummyQuestionId",
  ans: {
    text: '<script>alert("XSS")</script>',
  }
};

// Mock answer 
const mockAnswer: IAnswer = {
  _id: "dummyAnswerId",
  text: "This is a test answer",
  ans_by: "testuser",
  ans_date_time: new Date('2024-06-03T12:00:00Z'), // will be overwritten on save
};

/**
 * Tests answer-related routes.
 *
 * This test suite verifies the functionality of the `POST /addAnswer` API endpoint, 
 * which is responsible for adding a new answer to a question.
 *
 * The tests cover the following aspects:
 * - Successful answer creation and addition to the question.
 * - Error handling and appropriate status codes (400, 401, 403, 500).
 * - Authentication and authorization using JWT.
 * - Correct interaction with the application model functions (`saveAnswer`, `addAnswerToQuestion`).
 */
describe("POST /addAnswer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add a new answer to the question", async () => {
    app.use(mockAuthMiddleware);

    (saveAnswer as jest.Mock).mockResolvedValue(mockAnswer);
    (addAnswerToQuestion as jest.Mock).mockResolvedValue({
      _id: "dummyQuestionId",
      answers: ["dummyAnswerId"]
    });

    const token = generateValidJWT();
    const response = await request(app)
      .post("/addAnswer")
      .set('Authorization', `Bearer ${token}`)
      .send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(mockAnswer._id);
    expect(response.body.text).toEqual(mockAnswer.text);
    expect(response.body.ans_by).toEqual(mockAnswer.ans_by);

    expect(saveAnswer).toHaveBeenCalledTimes(1); 

    // checks that saveAnswer was called using mockReqBody parameters, but excludes overwritten ans_date_time field
    const calledWithAnswer = (saveAnswer as jest.Mock).mock.calls[0][0]; 
    expect(calledWithAnswer.text).toEqual(mockReqBody.ans.text);
    expect(calledWithAnswer.ans_by).toEqual(mockReqBody.ans.ans_by);

    expect(addAnswerToQuestion).toHaveBeenCalledWith(mockReqBody.qid, mockAnswer);
  });

  it('should sanitize stored input to prevent XSS attacks', async () => {
    app.use(mockAuthMiddleware);

    (saveAnswer as jest.Mock).mockResolvedValue({});

    const token = generateValidJWT();
    const response = await request(app)
      .post('/addAnswer')
      .set('Authorization', `Bearer ${token}`)
      .send(mockReqXSSBody);

    expect(response.status).toBe(200);

    const expectedText = xss('<script>alert("XSS")</script>', xssOptions);

    expect(saveAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        ans_by: "testuser",
        text: expectedText,
        ans_date_time: expect.any(Date)
      })
    );
  });

  it('should return 401 Unauthorized if no JWT is provided', async () => {
    app.use(mockAuthMiddleware);

    const response = await request(app)
      .post("/addAnswer")
      .send(mockReqBody); 

    expect(response.status).toBe(401); 
  });

  it('should return 401 Unauthorized if user is not authenticated', async () => {
    const response = await request(app)
      .post('/addAnswer')
      .send(mockReqBody);

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized'); 
  });

  it('should return 403 Forbidden if an invalid JWT is provided', async () => {
    app.use(mockAuthMiddleware);

    const invalidToken = 'invalid-jwt';
    const response = await request(app)
      .post("/addAnswer")
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(mockReqBody);

    expect(response.status).toBe(403); 
  });

  it('should return 400 Bad Request if required fields are missing', async () => {
    app.use(mockAuthMiddleware);

    const token = generateValidJWT();
    const response = await request(app)
      .post("/addAnswer")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        // Missing qid or ans properties
        ans: {
          text: "This is a test answer",
          ans_date_time: new Date('2024-06-03T12:00:00Z'),
        } 
      });

    expect(response.status).toBe(400); 
  });


  it('should return 500 Internal Server Error if saveAnswer throws an error', async () => {
    app.use(mockAuthMiddleware);

    (saveAnswer as jest.Mock).mockRejectedValue(new Error('Database error'));

    const token = generateValidJWT();
    const response = await request(app)
      .post("/addAnswer")
      .set('Authorization', `Bearer ${token}`)
      .send(mockReqBody);

    expect(response.status).toBe(500); 
  });

  it('should return 500 Internal Server Error if addAnswerToQuestion throws an error', async () => {
    app.use(mockAuthMiddleware);

    (saveAnswer as jest.Mock).mockResolvedValue(mockAnswer);
    (addAnswerToQuestion as jest.Mock).mockRejectedValue(new Error('Database error'));

    const token = generateValidJWT();
    const response = await request(app)
      .post("/addAnswer")
      .set('Authorization', `Bearer ${token}`)
      .send(mockReqBody);

    expect(response.status).toBe(500);
  });
});