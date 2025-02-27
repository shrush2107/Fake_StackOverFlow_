import cors from 'cors';
import mongoose from 'mongoose';
import express, { type Express } from 'express';
import { Server } from 'http';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { MONGO_URL, CLIENT_URL, port } from './config';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined. Set it in your environment variables.');
}

mongoose.connect(MONGO_URL);

const app: Express = express();
app.set('trust proxy', 1);

// Global rate limiter
/**
 * Rate limiter to prevent abuse of the API
 * by limiting the number of requests from the same IP
 * to 1000 requests per 15 minutes
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply global rate limiter
app.use(apiLimiter);

/**
 * Middleware to allow cross-origin requests
 * from the client-side
 */
app.use(
  cors({
    origin: [CLIENT_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/**
 * Middleware to parse incoming requests
 */
app.use(express.json());

app.get('/', (req, res) => {
  res.send('REST Service for Fake SO');
  res.end();
});

import answerController from './controller/answer';
import questionController from './controller/question';
import tagController from './controller/tag';
import authController from './controller/auth';

/**
 * Rate limiter for the auth routes
 * to prevent abuse of the API
 * by limiting the number of requests from the same IP 
 * to 250 requests per 15 minutes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 250,
  message: 'Too many login/signup attempts from this IP, please try again after 15 minutes',
});

app.use('/auth', authLimiter);
app.use('/auth', authController);
app.use('/question', questionController);
app.use('/tag', tagController);
app.use('/answer', answerController);

// Start the server and assign it to the 'server' variable
const server: Server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

/**
 * Gracefully close the server and the database connection
 */
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed.');
  });
  mongoose.disconnect().then(() => {
    console.log('Database instance disconnected.');
    process.exit(0);
  }).catch((err) => {
    console.error('Error during disconnection:', err);
    process.exit(1);
  });
});


//module.exports = server;
export default server;
