import express from 'express';
import xss from 'xss'; 
import { xssOptions } from '../util/xssOptions';

import {
  saveAnswer,
  addAnswerToQuestion,
  updateAnswer,
  deleteAnswer,
  removeAnswerFromQuestion,

} from '../models/application'
import {
  IAnswer 
} from '../models/types/types';
import authenticateJWT from '../middleware/authMiddleware';
import { Request } from 'express';

const router = express.Router()

interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

/**
 * Defines a POST route handler for adding an answer
 * @param {AuthenticatedRequest} req The incoming HTTP request object
 * @param {express.Response} res The outgoing HTTP response object
 * @returns {void}
 */
router.post('/addAnswer', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { qid, ans } = req.body;

  // Get the authenticated user's ID from req.user
  const ans_by = req.user?.username || '';
  if (!ans_by) {
    return res.status(401).send('Unauthorized');
  }

  // Validate required properties for the answer
  if (!qid || !ans || !ans.text) {
    return res.status(400).send('Invalid answer body');
  }

  // Sanitize the answer text using xss
  const cleanAnswerText = xss(ans.text, xssOptions);

  if (!cleanAnswerText) { 
    return res.status(400).send('Invalid input after sanitization'); 
  }

  // Create an answer object with the sanitized text
  const answerObject: IAnswer = {
    text: cleanAnswerText,
    ans_date_time: new Date(),
    ans_by,
  };

  try {
    // Save the answer in the database
    const savedAnswer = await saveAnswer(answerObject);

    if (!savedAnswer || 'error' in savedAnswer) {
      return res.status(500).json({ error: 'Database error while saving the answer' });
    }

    // Add the answer to the corresponding question
    const updatedQuestion = await addAnswerToQuestion(qid, savedAnswer);

    if (!updatedQuestion || 'error' in updatedQuestion) {
      return res.status(500).json({ error: 'Database error while updating the question' });
    }

    // Respond with the saved answer
    res.status(200).json(savedAnswer);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * Defines a POST route handler for updating an answer
 * @param {AuthenticatedRequest} req The incoming HTTP request object
 * @param {express.Response} res The outgoing HTTP response object
 * @returns {void}
 */
router.post('/updateAnswer', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { aid, text } = req.body;
  const ans_by = req.user?.username || '';

  if (!aid || !text) {
    return res.status(400).send('Missing required fields');
  }

  const cleanAnswerText = xss(text, xssOptions);

  if (!cleanAnswerText) { 
    return res.status(400).send('Invalid input after sanitization'); 
  }

  try {
    const updatedAnswer = await updateAnswer(aid, text, ans_by);
    
    if ('error' in updatedAnswer) {
      return res.status(updatedAnswer.status).send(updatedAnswer.error);
    }

    res.status(200).json(updatedAnswer);
  } catch (error) {
    console.error('Error updating answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Defines a POST route handler for deleting an answer
 * @param {AuthenticatedRequest} req The incoming HTTP request object
 * @param {express.Response} res The outgoing HTTP response object
 * @returns {void} 
 */
router.post('/deleteAnswer', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { aid, qid } = req.body;
  const ans_by = req.user?.username;
  if (!ans_by) {
    return res.status(401).send('Unauthorized');
  }

  if (!aid || !qid) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const result = await deleteAnswer(aid, ans_by);
    
    if ('error' in result) {
      return res.status(result.status).send(result.error);
    }

    await removeAnswerFromQuestion(qid, aid);

    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;

