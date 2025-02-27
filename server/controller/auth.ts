import express from 'express';
import xss from 'xss';
import { xssOptions } from '../util/xssOptions';
import { registerUser, loginUser, getUserDetails } from '../models/application';
import authenticateJWT from '../middleware/authMiddleware';
import { Request} from 'express';

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

const router = express.Router();

/**
 *   Defines a POST route handler for user signup
 *  @param {express.Request} req The incoming HTTP request object
 *  @param {express.Response} res The outgoing HTTP response object
 *  @returns {void}
 */
router.post('/signup', async (req, res) => {
  const { email, password, username, aboutme, linkedInLink } = req.body;

  if (!email || !password || !username || !aboutme || !linkedInLink) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const cleansedEmail = xss(email, xssOptions);
  const cleansedPassword = xss(password, xssOptions); 
  const cleansedUsername = xss(username, xssOptions); 
  const cleansedAboutMe = xss(aboutme, xssOptions);
  const cleansedLinkedInLink = xss (linkedInLink, xssOptions);

  if (!cleansedEmail || !cleansedPassword || !cleansedUsername 
    || !cleansedAboutMe || !cleansedLinkedInLink) {
  return res.status(400).json({ 
    success: false, 
    message: 'Invalid or missing input after sanitization' 
  });
}

  try {
    const newUser = await registerUser(cleansedEmail, cleansedPassword, cleansedUsername, cleansedAboutMe, cleansedLinkedInLink);
    
    res.json({
      success: true,
      message: 'Signup successful',
      user: {
        _id: newUser.user._id,
        username: newUser.user.username,
        email: newUser.user.email,
        aboutme: newUser.user.aboutme,
        linkedInLink: newUser.user.linkedInLink,
      },
      token: newUser.token, // Include the token in the response
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ success: false, message: errorMessage });
  }
});


/**
 * Defines a POST route handler for user login
 *  @param {express.Request} req The incoming HTTP request object
 *  @param {express.Response} res The outgoing HTTP response object
 *  @returns {void}
 */
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Email/Username and password are required' });
  }

  const cleansedEmailOrUsername = xss(emailOrUsername, xssOptions);
  const cleansedPassword = xss(password, xssOptions);

  if (!cleansedEmailOrUsername || !cleansedPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email/username or password' 
    });
  }

  try {
    const { user, token } = await loginUser(cleansedEmailOrUsername, cleansedPassword);

    res.json({
      success: true,
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(401).json({ success: false, message: errorMessage });
  }
});

/**
 * Defines a GET route handler for getting user details
 *  @param {express.Request} req The incoming HTTP request object
 *  @param {express.Response} res The outgoing HTTP response object
 *  @returns {void}
 */
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const userDetails = await getUserDetails(req.user.userId);

    res.json({
      success: true,
      user: userDetails,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    const statusCode = errorMessage === 'User not found' ? 404 : 500;

    res.status(statusCode).json({ success: false, message: errorMessage });
  }
});

export default router;
