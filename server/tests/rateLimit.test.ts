import request from 'supertest';
import mongoose from 'mongoose';
import server from '../server';
import * as authModel from '../models/application'; 

jest.mock('../models/application'); 

/**
 * Tests the rate limiting functionality for the `/auth/login` route.
 * 
 * This test suite verifies that the rate limiter correctly blocks excessive login 
 * attempts from the same IP address. It sends a number of requests to the 
 * `/auth/login` endpoint and asserts the following:
 * 
 * - Requests below the rate limit should return a 200 (OK) status code.
 * - The request that exceeds the rate limit should return a 429 (Too Many Requests)
 *   status code with the appropriate error message.
 * 
 * The test also mocks the `loginUser` function to avoid actual authentication 
 * logic and focuses solely on the rate limiting behavior.
 */
describe('Rate Limiting', () => {
    let serverInstance: typeof server;

    beforeAll(async () => {
        serverInstance = await server; 
      });

    afterAll(async () => {
        await serverInstance.close(); 
        await mongoose.disconnect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should rate limit requests to /auth/login', async () => {

        (authModel.loginUser as jest.Mock).mockResolvedValue({
        user: {
            _id: 'dummyUserId',
            username: 'testuser',
            email: 'testemail',
            aboutme: 'testme',
            linkedInLink: 'testlinked',
        },
        token: 'dummyToken',
        });

        const numRequests = 251;

        for (let i = 0; i < numRequests; i++) {
        try {
            const response = await request(server) // Use request(server)
            .post('/auth/login')
            .send({
                emailOrUsername: 'testuser',
                password: 'password',
            });

            console.log(`Request ${i + 1}: ${response.status}`);

            if (i < numRequests - 1) {
            expect(response.status).toBe(200);
            } else {
            expect(response.status).toBe(429);
            expect(response.text).toBe(
                'Too many login/signup attempts from this IP, please try again after 15 minutes'
            );
            }
        } catch (error) {
            console.error(`Request ${i + 1}: ${error}`);
            throw error;
        }
        }
    });
});
