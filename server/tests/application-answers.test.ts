import { 
  saveAnswer, 
  updateAnswer,
  deleteAnswer,
 } from '../models/application';

import { 
 _ans3,
_questions,
} from '../tests/test-data/mockApplicationObjects'

import { IAnswer } from '../models/types/types';
import Questions from '../models/questions';

import Answers from '../models/answers';
import mongoose from 'mongoose';  

const mockingoose = require('mockingoose');

jest.mock('jsonwebtoken');

Questions.schema.path('answers', Array);
Questions.schema.path('tags', Array);

/**
 * This test suite contains unit tests for the business logic of the Answers model in the application.
 * It covers the following functionalities:
 * - Saving a new answer
 * - Updating an existing answer
 * - Deleting an answer
 */
describe('application module - Answer tests', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveAnswer', () => {
    it('should save answer', async () => {
      mockingoose(Questions).toReturn(_questions[0], 'findOne');
      mockingoose(Questions)
        .toReturn({ ..._questions[0], answers: [..._questions[0].answers, _ans3] }, 'save');
      const currentAnswer: IAnswer = {
        _id: "test",
        text: "test",
        ans_by: "test",
        ans_date_time: new Date('2023-11-20T09:24:00'),
      };
      const result = await saveAnswer(currentAnswer);
      expect((result as IAnswer)._id).toBeDefined();
    });
  });

  describe('updateAnswer', () => {
    it('should update an answer successfully', async () => {
      const aid = new mongoose.Types.ObjectId('656329d9489990701549f88f');
      const ans_by = 'testuser';
      const updatedText = 'Updated answer text';
  
      const mockAnswer: IAnswer = {
        text: 'Original answer text',
        ans_by,
        ans_date_time: new Date(),
      };
  
      mockingoose(Answers).toReturn(mockAnswer, 'findOne', { _id: aid });
      mockingoose(Answers).toReturn({ ...mockAnswer, text: updatedText }, 'findOneAndUpdate');
  
      const result = await updateAnswer(aid.toString(), updatedText, ans_by);
  
      if ('text' in result) {
        expect(result.ans_by).toEqual(ans_by);
        expect(result.text).toEqual(updatedText);
      } else {
        fail('updateAnswer returned an error');
      }
    });
  
    it('should return 404 Not Found if answer is not found', async () => {
      const aid = new mongoose.Types.ObjectId('656329d9489990701549f88f');
  
      mockingoose(Answers).toReturn(null, 'findOne', { _id: aid }); 
      const result = await updateAnswer(aid.toString(), 'Updated text', 'testuser');
  
      expect(result).toEqual({ error: 'Answer not found', status: 404 });
    });
  
    it('should return 403 Forbidden if the user is not the author of the answer', async () => {
      const aid = new mongoose.Types.ObjectId('656329d9489990701549f88f');
      const mockAnswer: IAnswer = {
        text: 'Original answer text',
        ans_by: 'testuser',
        ans_date_time: new Date(),
      };
  
      mockingoose(Answers).toReturn(mockAnswer, 'findOne', { _id: aid });
      const result = await updateAnswer(aid.toString(), 'Updated text', 'anotheruser');
  
      expect(result).toEqual({ error: 'Forbidden', status: 403 });
    });
  });
  
  describe('deleteAnswer', () => {
    it('should delete an answer successfully', async () => {
      const aid = new mongoose.Types.ObjectId('656329d9489990701549f88f');
      const ans_by = 'testuser';
      const mockAnswer: IAnswer = {
        text: 'Original answer text',
        ans_by,
        ans_date_time: new Date(),
      };
  
      mockingoose(Answers).toReturn(mockAnswer, 'findOne', { _id: aid });
      mockingoose(Answers).toReturn(undefined, 'findOneAndDelete');
  
      const result = await deleteAnswer(aid.toString(), ans_by);
      expect(result).toEqual({ success: true });
    });
  
    it('should return 404 Not Found if answer is not found', async () => {
      const aid = new mongoose.Types.ObjectId('656329d9489990701549f88f');
  
      mockingoose(Answers).toReturn(null, 'findOne', { _id: aid });
      const result = await deleteAnswer(aid.toString(), 'testuser');
  
      expect(result).toEqual({ error: 'Answer not found', status: 404 });
    });
  
    it('should return 403 Forbidden if the user is not the author of the answer', async () => {
      const aid = new mongoose.Types.ObjectId('656329d9489990701549f88f');
      const mockAnswer: IAnswer = {
        text: 'Original answer text',
        ans_by: 'anotheruser',
        ans_date_time: new Date(),
      };
  
      mockingoose(Answers).toReturn(mockAnswer, 'findOne', { _id: aid });
      const result = await deleteAnswer(aid.toString(), 'testuser');
  
      expect(result).toEqual({ error: 'Forbidden', status: 403 });
    });
  });
});