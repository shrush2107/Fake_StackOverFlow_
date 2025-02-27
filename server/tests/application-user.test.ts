import {  
  registerUser, 
  loginUser, 
  getUserDetails, 
} from '../models/application';

import { IUser } from '../models/types/types';
import Questions from '../models/questions';
import User from '../models/user';
import mongoose from 'mongoose';  

const mockingoose = require('mockingoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

// SECRET_KEY used for testing purposes
const SECRET_KEY = 'de59f991a74bd7bcce70b1cfd1266dd33fcb8517b7aa85545b5406bf1c63e4f4156900f97c0090683f9c39ebd4860dd3939d14970c9cc5aaf480e222380f2e67'; 

Questions.schema.path('answers', Array);
Questions.schema.path('tags', Array);

/**
 * This class contains unit tests for the business logic of the User model in the application.
 * It covers the following functionalities:
 * - Registering a new user
 * - Logging in a user
 * - Retrieving user details
 */
describe('application module- User tests', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        username: 'User1',
        email: 'user1@gmail.com',
        password: 'User1@1234',
        aboutme: 'About user1',
        linkedInLink: 'https://www.linkedin.com/in/user1'
      };

      const mockUserId = new mongoose.Types.ObjectId();
      mockingoose(User).toReturn({ ...mockUser, _id: mockUserId }, 'create');

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(mockUser.password, salt);

      mockingoose(User)
        .toReturn(null, 'findOne', { email: mockUser.email })
        .toReturn(null, 'findOne', { username: mockUser.username })
        .toReturn({ ...mockUser, _id: mockUserId, password: hashedPassword, createdAt: new Date() }, 'create');

      jwt.sign.mockReturnValue('mockToken');

      const result = await registerUser(
        mockUser.email,
        mockUser.password,
        mockUser.username,
        mockUser.aboutme,
        mockUser.linkedInLink
      );

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: result.user._id, username: result.user.username },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      expect(result.user.username).toBe(mockUser.username);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.aboutme).toBe(mockUser.aboutme);
      expect(result.user.linkedInLink).toBe(mockUser.linkedInLink);
      expect(result.token).toBe('mockToken');
    });

    it('should throw an error if the email already exists', async () => {
      const mockUser = {
        username: 'User1',
        email: 'user1@gmail.com',
        password: 'User1@1234',
        aboutme: 'About user1',
        linkedInLink: 'https://www.linkedin.com/in/user1'
      };

      mockingoose(User).toReturn(mockUser, 'findOne', { email: mockUser.email });

      await expect(registerUser(
        mockUser.email,
        mockUser.password,
        mockUser.username,
        mockUser.aboutme,
        mockUser.linkedInLink
      )).rejects.toThrow('Email already exists');
    });

    it('should throw an error if the username already exists', async () => {
      const mockUser = {
        username: 'User2',
        email: 'user2@gmail.com',
        password: 'User2@1234',
        aboutme: 'About user2',
        linkedInLink: 'https://www.linkedin.com/in/user2'
      };

      mockingoose(User).toReturn(mockUser, 'findOne', { username: mockUser.username });

      await expect(registerUser(
        mockUser.email,
        mockUser.password,
        mockUser.username,
        mockUser.aboutme,
        mockUser.linkedInLink
      )).rejects.toThrow('Email already exists'); 
    });
  });

  describe('loginUser', () => {

    it('should successfully log in a user with valid credentials', async () => {

      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const mockUser: IUser = {
        username: 'User1',
        email: email,
        password: hashedPassword, 
        aboutme: 'About user1',
        linkedInLink: 'https://www.linkedin.com/in/user1'
      };

      mockingoose(User).toReturn(mockUser, 'findOne');

      const result = await loginUser('User1', password);
  
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: result.user._id, username: mockUser.username },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('username', mockUser.username);
      expect(result).toHaveProperty('token', 'mockToken'); 
    });

    it('should throw an error for an invalid email/username', async () => {
      mockingoose(User).toReturn(null, 'findOne');
      await expect(loginUser('invaliduser@example.com', 'password'))
        .rejects.toThrow('Invalid email/username or password');
    });

    it('should throw an error for an incorrect password', async () => {

      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const mockUser = {
        username: 'User1',
        email: email,
        password: hashedPassword, 
        aboutme: 'About user1',
        linkedInLink: 'https://www.linkedin.com/in/user1'
      };

      mockingoose(User).toReturn(mockUser, 'findOne');
      const mockCompare = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(loginUser('user1@gmail.com', 'incorrect-password'))
        .rejects.toThrow('Invalid email/username or password');
      mockCompare.mockRestore();
    });
  });

  describe('getUserDetails', () => {
    it('should successfully retrieve user details for a valid userId', async () => {
      const mockUser = {
        _id: '656190e3b346fa09e55f728a',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
        aboutme: 'Test user about me',
        linkedInLink: 'linkedin.com/in/testuser',
        __v: 0,
      };

      mockingoose(User).toReturn(mockUser, 'findOne');

      const result = await getUserDetails('656190e3b346fa09e55f728a');
      result._id = result._id.toString();

      expect(result).toEqual({
        _id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        aboutme: mockUser.aboutme,
        linkedInLink: mockUser.linkedInLink,
      });
    });

    it('should throw an error for an invalid userId', async () => {
      mockingoose(User).toReturn(null, 'findOne');
      await expect(getUserDetails('invalid_user_id')).rejects.toThrow('User not found');

    });
  });
});