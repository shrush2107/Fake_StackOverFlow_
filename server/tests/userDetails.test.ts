import request from 'supertest';
import express from 'express';
import router from '../controller/auth';
import { getUserDetails } from '../models/application';
import { mockAuthMiddleware, generateValidJWT } from './test-functions/mockAuthMiddleware';

jest.mock('../models/application');

const app = express();
app.use(express.json());
app.use('/', router);

/**
 * Tests user authentication and details retrieval.
 *
 * This test suite verifies the functionality of the `/me` API endpoint, 
 * which is responsible for retrieving user details for an authenticated user.
 *
 * The tests cover the following aspects:
 * - Successful retrieval of user details with a valid JWT.
 * - Error handling and appropriate status codes (401, 403, 500).
 * - Authentication and authorization using JWT.
 * - Correct interaction with the application model function (`getUserDetails`).
 */
describe('User routes', () => {  
  describe('getUserDetails', () => { 
    beforeEach(() => {
      jest.clearAllMocks(); 
    });

    const mockUserDetails = {
        username: 'testuser',
        email: 'testuser@example.com',
        aboutme: 'Test user about me',
        linkedInLink: 'linkedin.com/in/testuser',
    }

    it('should return user details when user is found', async () => {
        app.use(mockAuthMiddleware);

        (getUserDetails as jest.Mock).mockResolvedValue(mockUserDetails);

        const token = generateValidJWT();

        const response = await request(app)
        .get("/me")
        .set('Authorization', `Bearer ${token}`)
        .send();

        expect(response.status).toBe(200);
        expect(response.body.user).toEqual(mockUserDetails);
    });  

    it('should return 401 Unauthorized if no JWT is provided', async () => {
        const response = await request(app).get("/me").send(); 

        expect(response.status).toBe(401);
        expect(response.body).toEqual({});
    });

    it('should return 403 Forbidden if an invalid JWT is provided', async () => {
        const invalidToken = 'invalid-jwt'; 
        const response = await request(app)
            .get("/me")
            .set('Authorization', `Bearer ${invalidToken}`)
            .send();

        expect(response.status).toBe(403); 
    });


    it('should return 500 Internal Server Error for other errors', async () => {
        app.use(mockAuthMiddleware);
        (getUserDetails as jest.Mock).mockRejectedValue(new Error('Database error'));
  
        const token = generateValidJWT();
        const response = await request(app)
          .get("/me")
          .set('Authorization', `Bearer ${token}`)
          .send();
  
        expect(response.status).toBe(500); 
        expect(response.body).toEqual({ 
          success: false, 
          message: 'Database error' 
        });
      });
    });
  });
