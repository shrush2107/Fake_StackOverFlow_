import { 
  addTag, 
  getTagIds, 
  getTagCountMap, 
 } from '../models/application';

import { 
_tag1, _tag2, _tag3, 
_questions,
} from '../tests/test-data/mockApplicationObjects'

import Questions from '../models/questions';
import Tags from '../models/tags';

const mockingoose = require('mockingoose');

jest.mock('jsonwebtoken');

Questions.schema.path('answers', Array);
Questions.schema.path('tags', Array);

/**
 * This class contains unit tests for the business logic of the Tags model in the application.
 * It covers the following functionalities:
 * - Adding a new tag
 * - Retrieving a list of tag IDs
 * - Getting a map of tag counts (how many times each tag is used)
 */
describe('application module - Tag tests', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('addTag', () => {
    it('should return tag id if the tag already exists', async () => {
      mockingoose(Tags).toReturn(_tag1, 'findOne');
      const result = await addTag('react');
      if (result) {
        expect(result.toString()).toEqual(_tag1._id?.toString());
      } else {
        fail(`Expected a String but got null`);
      }
    });

    it('addTag return tag id of new tag if does not exist in database', async () => {
      mockingoose(Tags).toReturn(null, 'findOne');
      const result = await addTag('javascript');
      expect(result).toBeDefined();
    });

    it('addTag returns null if findOne throws an error', async () => {
      mockingoose(Tags).toReturn(new Error('error'), 'findOne');
      const result = await addTag('react');
      expect(result).toBeNull();
    });

    it('addTag returns null if save throws an error', async () => {
      mockingoose(Tags).toReturn(null, 'findOne');
      mockingoose(Tags).toReturn(new Error('error'), 'save');
      const result = await addTag('javascript');
      expect(result).toBeNull();
    });
  });

  describe('getTagIds', () => {
    it('should return list of tag ids', async () => {
      mockingoose(Tags).toReturn(_tag1, 'findOne');
      mockingoose(Tags).toReturn(_tag2, 'findOne');
      const result = await getTagIds(['react', 'javascript']);
      expect(result.length).toEqual(2);
    });
  });

  describe('getTagCountMap', () => {
    it('should return tag count map', async () => {
      mockingoose(Tags).toReturn([_tag1, _tag2, _tag3], 'find');
      const result = await getTagCountMap();
      if (result && !(result instanceof Map) && 'error' in result) {
        fail(`Expected a Map but got an error: ${result.error}`);
      } else if (result instanceof Map) {
        expect(result.get('react')).toBeDefined();
        expect(result.get('javascript')).toBeDefined();
        expect(result.get('android')).toBeDefined();
      } else {
        fail('Expected a Map but got null');
      }
    });

    it('should return tag count map with the expected number of questions for each tag', async () => {
      mockingoose(Tags).toReturn([_tag1, _tag2, _tag3], 'find');
      mockingoose(Questions).toReturn(_questions, 'find');
      const result = await getTagCountMap();


      if (result && !(result instanceof Map) && 'error' in result) {
        fail(`Expected a Map but got an error: ${result.error}`);
      } else if (result instanceof Map) {
        expect(result.get('react')).toEqual(1);
        expect(result.get('javascript')).toEqual(2);
        expect(result.get('android')).toEqual(1);
      } else {
        fail('Expected a Map but got null');
      }
    });
  });
});