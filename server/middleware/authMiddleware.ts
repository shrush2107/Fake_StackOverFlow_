import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string; // Use your secret key

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

/**
 *  Middleware to authenticate JWT token
 * @param req   Request with JWT token
 * @param res   Response  Object
 * @param next  NextFunction-Callback function to pass control to the next middleware
 */
const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length);

    jwt.verify(token, SECRET_KEY, (err, decoded: any) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
      }
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
      };
      next();
    });
  } else {
    res.sendStatus(401); // No token provided
  }
};

export default authenticateJWT;
