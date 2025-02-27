import request from 'supertest';
import express from 'express';
import router from '../controller/auth';
import { registerUser, loginUser, getUserDetails } from '../models/application';
import xss from 'xss';
import { xssOptions } from '../util/xssOptions';
import { mockAuthMiddleware, generateValidJWT } from './test-functions/mockAuthMiddleware';

jest.mock('../models/application');

const app = express();
app.use(express.json());
app.use('/', router);

// Mock User Data (with sanitized values where applicable)
const mockUser = {
  _id: 'some_user_id',
  username: 'testuser',
  email: 'testuser@example.com',
  aboutme: 'Test user about me',
  linkedInLink: 'linkedin.com/in/testuser',
};

const mockNewUser = {
  user: { ...mockUser },
  token: 'some_jwt_token',
};

const mockLoginResponse = {
  user: { ...mockUser },
  token: 'some_jwt_token',
};

describe('Auth routes', () => {
  describe('POST /signup', () => {
    it('should register a new user successfully', async () => {
      (registerUser as jest.Mock).mockResolvedValue(mockNewUser);

      const response = await request(app)
        .post('/signup')
        .send({
          email: mockUser.email,
          password: 'testpassword',
          username: mockUser.username,
          aboutme: mockUser.aboutme,
          linkedInLink: mockUser.linkedInLink,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Signup successful',
        user: mockNewUser.user,
        token: mockNewUser.token,
      });

      expect(registerUser).toHaveBeenCalledWith(
        mockUser.email,
        'testpassword',
        mockUser.username,
        mockUser.aboutme,
        mockUser.linkedInLink
      );
    });

    it('should return 400 Bad Request if required fields are missing', async () => {
      const response = await request(app).post('/signup').send({
        email: mockUser.email,
        password: 'testpassword',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'All fields are required',
      });
    });

    it('should sanitize input to prevent XSS attacks', async () => {
      const sanitizedUser = {
        _id: 'some_user_id',
        username: xss('<script>alert("XSS")</script>', xssOptions),
        email: xss('<script>alert("XSS")</script>', xssOptions),
        aboutme: xss('<script>alert("XSS")</script>', xssOptions),
        linkedInLink: xss('<script>alert("XSS")</script>', xssOptions),
      };

      const sanitizedNewUser = {
        user: { ...sanitizedUser },
        token: 'some_jwt_token',
      };

      (registerUser as jest.Mock).mockResolvedValue(sanitizedNewUser);

      const response = await request(app)
        .post('/signup')
        .send({
          email: '<script>alert("XSS")</script>',
          password: '<script>alert("XSS")</script>',
          username: '<script>alert("XSS")</script>',
          aboutme: '<script>alert("XSS")</script>',
          linkedInLink: '<script>alert("XSS")</script>',
        });

      expect(response.status).toBe(200);

      expect(registerUser).toHaveBeenCalledWith(
        sanitizedUser.email,
        xss('<script>alert("XSS")</script>', xssOptions),
        sanitizedUser.username,
        sanitizedUser.aboutme,
        sanitizedUser.linkedInLink
      );
    });
  });

  describe('POST /login', () => {
    it('should log in a user successfully', async () => {
      (loginUser as jest.Mock).mockResolvedValue(mockLoginResponse);

      const response = await request(app)
        .post('/login')
        .send({ emailOrUsername: mockUser.email, password: 'testpassword' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Login successful',
        user: mockLoginResponse.user,
        token: mockLoginResponse.token,
      });

      expect(loginUser).toHaveBeenCalledWith(mockUser.email, 'testpassword');
    });

    it('should return 400 Bad Request if required fields are missing', async () => {
      const response = await request(app).post('/login').send({
        emailOrUsername: mockUser.email,
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Email/Username and password are required',
      });
    });

    it('should sanitize input to prevent XSS attacks', async () => {
      const sanitizedUser = {
        _id: 'some_user_id',
        username: xss('<script>alert("XSS")</script>', xssOptions),
        email: xss('<script>alert("XSS")</script>', xssOptions),
        aboutme: xss('<script>alert("XSS")</script>', xssOptions),
        linkedInLink: xss('<a href="javascript:alert(\'XSS\')">click me</a>', xssOptions),
      };

      const sanitizedLoginResponse = {
        user: { ...sanitizedUser },
        token: 'some_jwt_token',
      };

      (loginUser as jest.Mock).mockResolvedValue(sanitizedLoginResponse);

      const response = await request(app)
        .post('/login')
        .send({
          emailOrUsername: '<script>alert("XSS")</script>',
          password: '<script>alert("XSS")</script>',
        });
    
      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(sanitizedLoginResponse.user); 

      expect(loginUser).toHaveBeenCalledWith(
        xss('<script>alert("XSS")</script>', xssOptions),
        xss('<script>alert("XSS")</script>', xssOptions)
      );
    });
  });

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
