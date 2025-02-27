import {  
  getQuestionsByOrder, 
  filterQuestionsBySearch, 
  fetchAndIncrementQuestionViewsById, 
  saveQuestion, 
  upvoteQuestion, 
  downvoteQuestion,   
 } from '../models/application';

import { 
_ans1, _ans2, _ans3, _ans4, 
_questions,
mockQuestionWithVote, mockQuestionWithVoteId,
mockQuestionWithoutVote, mockQuestionWithoutVoteId,
} from '../tests/test-data/mockApplicationObjects'

import { IQuestion } from '../models/types/types';
import Questions from '../models/questions';

const mockingoose = require('mockingoose');

jest.mock('jsonwebtoken'); 

Questions.schema.path('answers', Array);
Questions.schema.path('tags', Array);

/**
 * This test suite contains unit tests for the business logic of the Questions model in the application.
 * It covers the following functionalities:
 * - Retrieving questions by order (e.g., most recently answered, newest, unanswered)
 * - Filtering questions by search keywords and tags
 * - Fetching a question by ID and incrementing its views
 * - Saving a new question
 * - Upvoting and downvoting a question
 */
describe('application module - Question tests', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('filterQuestionsBySearch', () => {
    it('should return all questions with an empty search string', () => {
      const result = filterQuestionsBySearch(_questions, '');
      expect(result.length).toEqual(_questions.length);
    });

    it('should return an empty list with undefined questions', () => {
      const result = filterQuestionsBySearch(undefined, 'react');
      expect(result.length).toEqual(0);
    });

    it('should return an empty list with empty questions', () => {
      const result = filterQuestionsBySearch([], 'react');
      expect(result.length).toEqual(0);
    });

    it('should return an empty list with empty questions and an empty string', () => {
      const result = filterQuestionsBySearch([], '');
      expect(result.length).toEqual(0);
    });

    it('should filter questions by one tag', () => {
      const result = filterQuestionsBySearch(_questions, '[android]');
      expect(result.length).toEqual(1);
      expect(result[0]._id).toEqual('65e9b58910afe6e94fc6e6dc');
    });

    it('should filter questions by multiple tags', () => {
      const result = filterQuestionsBySearch(_questions, '[android] [react]');
      expect(result.length).toEqual(2);
      expect(result[0]._id).toEqual('65e9b58910afe6e94fc6e6dc');
      expect(result[1]._id).toEqual('65e9b5a995b6c7045a30d823');
    });

    it('should filter questions by one keyword', () => {
      const result = filterQuestionsBySearch(_questions, 'website');
      expect(result.length).toEqual(1);
      expect(result[0]._id).toEqual('65e9b5a995b6c7045a30d823');
    });

    it('should filter questions by tag and keyword', () => {
      const result = filterQuestionsBySearch(_questions, 'website [android]');
      expect(result.length).toEqual(2);
      expect(result[0]._id).toEqual('65e9b58910afe6e94fc6e6dc');
      expect(result[1]._id).toEqual('65e9b5a995b6c7045a30d823');
    });
  });

    describe('getQuestionsByOrder', () => {
      it('should get active questions, sorted by most recently answered 1', async () => {
        mockingoose(Questions).toReturn(_questions.slice(0, 3), 'find');
        const result = await getQuestionsByOrder('active');
        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });
  
      it('should get active questions, sorted by most recently answered 2', async () => {
        const questions = [
          { 
            _id: '65e9b716ff0e892116b2de01', 
            answers: [_ans1, _ans3], 
            ask_date_time: new Date('2023-11-20T09:24:00') 
          },
          { 
            _id: '65e9b716ff0e892116b2de02', 
            answers: [_ans1, _ans2, _ans3, _ans4], 
            ask_date_time: new Date('2023-11-20T09:24:00') 
          },
          { 
            _id: '65e9b716ff0e892116b2de03', 
            answers: [_ans2], 
            ask_date_time: new Date('2023-11-20T09:24:00') 
          }
        ];
  
        mockingoose(Questions).toReturn(questions, 'find');
        const result = await getQuestionsByOrder('active');
  
        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
      });
  
      it('should get newest questions', async () => {
        const questions = [
          { _id: '65e9b716ff0e892116b2de01', ask_date_time: new Date('2023-11-21T09:24:00') },
          { _id: '65e9b716ff0e892116b2de02', ask_date_time: new Date('2023-11-19T09:24:00') },
          { _id: '65e9b716ff0e892116b2de03', ask_date_time: new Date('2023-11-20T09:24:00') }
        ];
  
        mockingoose(Questions).toReturn(questions, 'find');
        const result = await getQuestionsByOrder('newest');
  
        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
      });
  
      it('should get unanswered questions', async () => {
        mockingoose(Questions).toReturn([_questions[2], _questions[3]], 'find');
        const result = await getQuestionsByOrder('unanswered');
  
        expect(result.length).toEqual(2);
        expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });
  });

  
  describe('fetchAndIncrementQuestionViewsById', () => {
    it('should throw error when given empty id', async () => {
      mockingoose(Questions).toReturn(new Error('error'), 'findOneAndUpdate');
      const result = await fetchAndIncrementQuestionViewsById('');
      expect(result).toEqual({ error: 'Error when fetching and updating a question' });
    });

    it('should return question object with incremented views', async () => {
      const question = _questions[0];
      const questionWithUpdatedViews = { ...question, views: question.views + 1 };
      mockingoose(Questions).toReturn(questionWithUpdatedViews, 'findOneAndUpdate');

      const result = await fetchAndIncrementQuestionViewsById('65e9b58910afe6e94fc6e6dc');
      expect((result as IQuestion)._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      expect((result as IQuestion).views).toEqual(49);
    });
  });

  describe('saveQuestion', () => {
    it('should save question with tag IDs', async () => {
      const currentQuestion: IQuestion = {
        _id: "test",
        title: 'How do I use async/await in JavaScript?',
        text: 'I need help understanding how to use async/await in JavaScript.',
        tags: [],
        answers: [],
        ask_date_time: new Date('2023-11-20T09:24:00'),
        asked_by: 'test',
        views: 0,
        votes: []
      };
      mockingoose(Questions).toReturn(_questions[0], 'create');
      const result = await saveQuestion(currentQuestion);
      expect(result).toHaveProperty('_id');
      expect((result as IQuestion)._id).toBeDefined();
    });
  });

  describe('upvoteQuestion', () => {
    it('should upvote a question', async () => {
      mockingoose(Questions)
        .toReturn(mockQuestionWithoutVote, 'findOne', { _id: mockQuestionWithoutVoteId });

      const question = await upvoteQuestion(mockQuestionWithoutVoteId.toString(), 'testuser');

      expect(question!.votes).toEqual(mockQuestionWithVote.votes);
      expect(question!.title).toEqual(mockQuestionWithVote.title);
      expect(question!.ask_date_time).toEqual(mockQuestionWithoutVote.ask_date_time);
    });

    it('should not upvote a question if the user has already upvoted', async () => {
      mockingoose(Questions)
        .toReturn(mockQuestionWithVote, 'findOne', { _id: mockQuestionWithVoteId });

      const question = await upvoteQuestion(mockQuestionWithVoteId.toString(), 'testuser');

      expect(mockQuestionWithVote.votes).toEqual(question!.votes);
      expect(mockQuestionWithVote.title).toEqual(question!.title);
      expect(mockQuestionWithVote.ask_date_time).toEqual(question!.ask_date_time);
    });

    it('should return null if the question is not found', async () => {
      mockingoose(Questions).toReturn(null, 'findOne');
      const question = await upvoteQuestion('nonExistentQuestionId', 'testuser');
      expect(question).toBeNull();
    });
  });

  describe('downvoteQuestion', () => {
    it('should downvote a question', async () => {
      mockingoose(Questions)
        .toReturn(mockQuestionWithVote, 'findOne', { _id: mockQuestionWithVoteId });

      const question = await downvoteQuestion(mockQuestionWithVoteId.toString(), 'testuser');

      expect(mockQuestionWithoutVote.votes).toEqual(question!.votes);
      expect(mockQuestionWithoutVote.title).toEqual(question!.title);
      expect(mockQuestionWithVote.ask_date_time).toEqual(question!.ask_date_time);
    });

    it('should not downvote a question if the user has not upvoted', async () => {
      mockingoose(Questions)
        .toReturn(mockQuestionWithoutVote, 'findOne', { _id: mockQuestionWithoutVoteId });

      const question = await downvoteQuestion(mockQuestionWithoutVoteId.toString(), 'testuser');

      expect(mockQuestionWithoutVote.votes).toEqual(question!.votes);
      expect(mockQuestionWithoutVote.title).toEqual(question!.title);
      expect(mockQuestionWithoutVote.ask_date_time).toEqual(question!.ask_date_time);
    });

    it('should return null if the question is not found', async () => {
      mockingoose(Questions).toReturn(null, 'findOne');
      const question = await downvoteQuestion('nonExistentQuestionId', 'testuser');
      expect(question).toBeNull();
    });
  });
});