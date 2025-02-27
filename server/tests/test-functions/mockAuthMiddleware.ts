import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

/**
 * This utility file provides helper functions for testing authentication and authorization logic.
 *
 * It includes functionalities for:
 * - Generating valid JWTs for simulating authenticated users.
 * - Mocking the authentication middleware to inject user data into requests for testing protected routes and controllers.
 */

interface AuthenticatedRequest extends Request {
    user?: { userId: string, username: string }; 
  }

  /**
 * Generates a valid JWT (JSON Web Token) for simulating an authenticated user in tests.
 *
 * @param userId The ID of the user to be encoded in the JWT (defaults to 'testId').
 * @param username The username of the user to be encoded in the JWT (defaults to 'testuser').
 * @returns A signed JWT containing the user ID and username.
 */
export const generateValidJWT = (userId: string = 'testId', username: string = 'testuser') => {
  return jwt.sign({ userId, username }, process.env.SECRET_KEY as string);
};

/**
 * Mocks the authentication middleware for testing protected routes and controllers.
 *
 * This function simulates the behavior of an authentication middleware by extracting the JWT from the
 * `Authorization` header of the request, verifying it, and injecting the user data into the request object.
 * If the token is valid, the `req.user` object will be populated with the user ID and username.
 * If the token is invalid or missing, it will respond with a 401 (Unauthorized) or 403 (Forbidden) status code.
 *
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The Express next function.
 */
export const mockAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as { userId: string, username: string };
      req.user = {
        userId: decoded.userId,
        username: decoded.username
      };
      next();
    } catch  {
      return res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};