import express, { Request } from 'express'
import xss from 'xss';
import { xssOptions } from '../util/xssOptions';

import {
  getQuestionsByOrder,
  filterQuestionsBySearch,
  fetchAndIncrementQuestionViewsById,
  getTagIds,
  saveQuestion,
  upvoteQuestion,
  downvoteQuestion,

} from '../models/application'

import {
  IQuestion,
  GetQuestionsByFilterRequest,
  GetQuestionByIdRequest,
  ITag,
} from '../models/types/types'

import authenticateJWT from '../middleware/authMiddleware';

const router = express.Router()

/**
 * Defines a POST route handler for adding a question
 * 
 * @param {express.Request} req The incoming HTTP request object
 * @param {express.Response} res The outgoing HTTP response object
 * @returns {void}
 */
interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

router.post('/addQuestion', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { title, text, tags, answers, views } = req.body;

    // Validate required properties
    if (!title || !text || !tags || tags.length === 0) {
      return res.status(400).send('Invalid question body');
    }

  const cleansedTitle = xss(title, xssOptions);
  const cleansedText = xss(text, xssOptions);

  // Extract and sanitize tag names
  const cleansedTags: ITag[] = tags.map((tag: ITag) => ({ name: xss(tag.name, xssOptions) }));

  // Validates that sanitization hasn't removed all text
  if (!cleansedTitle || !cleansedText || cleansedTags.some(tag => !tag.name)) { 
    return res.status(400).send('Invalid input after sanitization'); 
  }


  // Get the authenticated user's ID from req.user
  const asked_by = req.user?.username;
  if (!asked_by) {
    return res.status(401).send('Unauthorized');
  }
  const ask_date_time = new Date(); // Set the current date and time

  // Create an IQuestion object to pass to saveQuestion
  const questionObject: IQuestion = {
    title: cleansedTitle,
    text: cleansedText,
    tags: cleansedTags,
    asked_by,
    ask_date_time,
    answers,
    views,
    votes: [],
  };

  try {
    const savedQuestion = await saveQuestion(questionObject);
    res.status(200).json(savedQuestion);
    
  } catch (error) {
    console.error('Error saving question:', error);
    res.status(500).json('Database error');
  }
});


/**
 * Defines a GET route handler for fetching a question by ID
 * 
 * @param {express.Request} req The incoming HTTP request object
 * @param {express.Response} res The outgoing HTTP response object
 * @returns {void}
 */
router.get('/getQuestionById/:qid', async (req, res) => {
  const { qid } = req.params as GetQuestionByIdRequest['params'];
  try {
    const fetchedQuestion = await fetchAndIncrementQuestionViewsById(qid);
    res.status(200).json(fetchedQuestion); 
  } catch {
    return res.status(500).send({ error: 'Error fetching questions' });
  }
});

/**
 * Defines a POST route handler for retrieving tag IDs based on tag names
 * 
 * @param {express.Request} req The incoming HTTP request object
 * @param {express.Response} res The outgoing HTTP response object
 * @returns {void}
 */
router.post('/tag-ids', async (req, res) => {

    const tagNames = req.body.tagNames;
    const tagIds = await getTagIds(tagNames);
    res.json(tagIds);
});

/**
 * Defines a GET route handler for fetching questions based on filter parameters
 * 
 * @param {express.Request} req The incoming HTTP request object
 * @param {express.Response} res The outgoing HTTP response object
 * @returns {void}
 */
router.get('/getQuestion', async (req, res) => {
  const { order, search } = req.query as GetQuestionsByFilterRequest['query'];
    let questions;

    try {
      if (order && search) {
        const orderedQuestions = await getQuestionsByOrder(order);
        questions = await filterQuestionsBySearch(orderedQuestions, search);

      } else if (order && !search) {
        questions = await getQuestionsByOrder(order);

      } else if (search && !order) {

        questions = await getQuestionsByOrder('newset');
        questions = await filterQuestionsBySearch(questions, search);

      } else {
        questions = await getQuestionsByOrder('newest');
        questions = await filterQuestionsBySearch(questions, '');
      }
    } catch {
      return res.status(500).send({ error: 'Error fetching questions' });
    }

    res.status(200).json(questions);
  });


/**
 * Defines a POST route handler for upvoting a question
 * @param {express.Request} req The incoming HTTP request object
 * @param {express.Response} res The outgoing HTTP response object
 * @returns {void}
 */
router.post('/:questionId/upvote', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { questionId } = req.params;
  const user = req.user?.username;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const updatedQuestion = await upvoteQuestion(questionId, user);
    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ message: "Upvoted successfully", question: updatedQuestion });
  } catch (error) {
    console.error("Error upvoting question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/**
 * Defines a POST route handler for downvoting a question
 * @param {express.Request} req The incoming HTTP request object
 * @param {express.Response} res The outgoing HTTP response object
 * @returns {void}
 */
router.post('/:questionId/downvote', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { questionId } = req.params;
  const user = req.user?.username;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const updatedQuestion = await downvoteQuestion(questionId, user);
    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ message: "Downvoted successfully", question: updatedQuestion });
  } catch (error) {
    console.error("Error downvoting question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
