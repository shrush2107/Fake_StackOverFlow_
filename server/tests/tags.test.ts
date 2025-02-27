import request from 'supertest';
import express from 'express';
import router from '../controller/tag'; 
import { getTagCountMap } from '../models/application';

jest.mock('../models/application');

const app = express();
app.use(express.json());
app.use('/', router); 

/**
 * Tests the `GET /getTagsWithQuestionNumber` route.
 *
 * This test suite verifies the functionality of the API endpoint responsible for
 * retrieving tags along with the number of questions associated with each tag.
 * It covers the following scenarios:
 *
 * - Successful retrieval of tags with their corresponding question counts.
 * - Handling of cases where `getTagCountMap` returns null.
 * - Handling of errors thrown by `getTagCountMap`.
 */
describe('GET /getTagsWithQuestionNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return tags with question numbers', async () => {
    const mockTagCountMap = new Map<string, number>();
    mockTagCountMap.set('tag1', 2);
    mockTagCountMap.set('tag2', 1);
    (getTagCountMap as jest.Mock).mockResolvedValue(mockTagCountMap);

    const response = await request(app).get('/getTagsWithQuestionNumber');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { name: 'tag1', qcnt: 2 },
      { name: 'tag2', qcnt: 1 },
    ]);

    expect(getTagCountMap).toHaveBeenCalled();
  });

  it('should return error 500 if getTagCountMap returns null', async () => {
    (getTagCountMap as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get('/getTagsWithQuestionNumber');

    expect(response.status).toBe(500); 
  });

  it('should return error 500 if getTagCountMap throws an error', async () => {
    (getTagCountMap as jest.Mock).mockRejectedValue(new Error('Error fetching tags'));

    const response = await request(app).get('/getTagsWithQuestionNumber');

    expect(response.status).toBe(500);
  });
});