import Answers from '../models/answers'
import { IAnswer, IQuestion } from '../models/types/types'
import Questions from './questions'
import Tags from '../models/tags'
import Tag from '../models/tags'
import User from '../models/user'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
export type SortOrder = 'active' | 'newest' | 'unanswered'
export type ErrorWrapped<T> = { error: string } | T

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY as string;
if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined. Set it in your environment variables.');
}

/**
 * Updates an answer in the database
 * @param aid the answer id
 * @param text the updated text of the answer
 * @param ans_by the username of the user who posted the answer
 * @returns the updated answer object or an object with an error message if the operation failed
 */
const updateAnswer = async (aid: string, text: string, ans_by: string): Promise<IAnswer | { error: string; status: number }> => {

  const answer = await Answers.findById(aid);
  if (!answer) {
    return { error: 'Answer not found', status: 404 };
  }

  if (answer.ans_by !== ans_by) {
    return { error: 'Forbidden', status: 403 };
  }

  answer.text = text;
  await answer.save();
  return answer;
};

/**
 * Deletes an answer from the database
 * @param aid the answer id
 * @param ans_by the username of the user who posted the answer
 * @returns an object with a success property set to true if the operation was successful
 * or an object with an error message if the operation failed
 */
const deleteAnswer = async (aid: string, ans_by: string): Promise<{ success: true } | { error: string; status: number }> => {
  const answer = await Answers.findById(aid);
  if (!answer) {
    return { error: 'Answer not found', status: 404 };
  }

  if (answer.ans_by !== ans_by) {
    return { error: 'Forbidden', status: 403 };
  }

  await Answers.findByIdAndDelete(aid);
  return { success: true };
};


/**
 * Removes an answer from a question
 * @param qid the question id
 * @param aid the answer id
 */
const removeAnswerFromQuestion = async (qid: string, aid: string): Promise<void> => {
  await Questions.findByIdAndUpdate(qid, { $pull: { answers: aid } }, { new: true });
};


/**
 * A function to register a new user
 * @param email the email of the user
 * @param password the password of the user
 * @param username the username of the user
 * @param aboutme the aboutme of the user
 * @param linkedInLink the linkedInLink of the user
 * @returns an object with the user and token
 * or an object with an error message if the registration failed
 */
const registerUser = async (email: string, password: string, username: string, aboutme: string, linkedInLink: string) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new Error('Username already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    username,
    aboutme,
    linkedInLink,
    createdAt: new Date(),
  });

  const token = jwt.sign(
    { userId: newUser._id, username: newUser.username },
    SECRET_KEY,
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  return {
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      aboutme: newUser.aboutme,
      linkedInLink: newUser.linkedInLink,
    },
    token,
  };
};


/**
 * A function to login a user
 * @param emailOrUsername A string that can be either an email or a username
 * @param password A string that is the password of the user
 * @returns   an object with the user and token
 */
const loginUser = async (emailOrUsername: string, password: string) => {
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    throw new Error('Invalid email/username or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid email/username or password');
  }

  const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, {
    expiresIn: '1h',
  });

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      aboutme: user.aboutme,
      linkedInLink: user.linkedInLink,
    },
    token,
  };
};

/**
 * A function to get user details
 * @param userId the id of the user
 * @returns a user object
 * or an object with an error message if the user was not found
 */
const getUserDetails = async (userId: string) => {
  const user = await User.findById(userId).select('-password -__v');
  if (!user) {
    throw new Error('User not found');
  }
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    aboutme: user.aboutme,
    linkedInLink: user.linkedInLink,
  };
};

/**
 * Upvote a question by adding the user to the upvotes array.
 * @param questionId - The ID of the question to upvote.
 * @param username - The username of the authenticated user.
 * @returns The updated question document or null if not found.
 */
export const upvoteQuestion = async (questionId: string, username: string): Promise<IQuestion | null> => {
  const question = await Questions.findById(questionId);

  if (!question) {
    return null;
  }
  // Check if the user has already upvoted
  if (!question.votes.includes(username)) {
    question.votes.push(username);
    await question.save();
  }
  return question;
};

/**
 * Downvote a question by removing the user from the upvotes array.
 * @param questionId - The ID of the question to downvote.
 * @param username - The username of the authenticated user.
 * @returns The updated question document or null if not found.
 */
export const downvoteQuestion = async (questionId: string, username: string): Promise<IQuestion | null> => {
  const question = await Questions.findById(questionId);
  if (!question) {
    return null;
  }
  // Remove the user from upvotes if present
  if (question.votes.includes(username)) {
    question.votes = question.votes.filter(user => user !== username);
    await question.save();
  }

  return question;
};

/**
 * A function to add a tag to the database
 * @param tname the tag name
 * @returns the id of an existing tag or the id of the newly added tag
 */
const addTag = async (tname: string) => {

  try {
    const tag = await Tags.findOne({name: tname});
    if (tag) {
      return tag._id.toString();
    } else {
      const newTag = new Tag({name: tname});
      await newTag.save();
      return newTag._id.toString();
    }
  } catch {
    return null;
  }
};

/**
 * Will retrieve questions based on a specified order
 * @param string the order to sort the questions
 * @returns list of questions sorted by the specified order
 */
const getQuestionsByOrder = async (order: string): Promise<IQuestion[]> => {

  let query = Questions.find().populate({
    path: 'answers',
    model: Answers,
  });

  switch (order) {
    case "newest":
      query = query.sort('-createdAt');
      break;
    case "active":
      query = query.find({ 'answers.0': { $exists: true } });
      break;
    case "unanswered":
      query = query.find({ answers: { $size: 0 } });
      break;
    default:
      throw new Error('Invalid sort order');
  }

  const questions = await query;

  if (order === "active") {
    questions.sort((a, b) => {
      // ensures answers are sorted before identifying the latest answer
      sortAnswersByDate(a.answers);
      sortAnswersByDate(b.answers);
      const latestAnswerA = a.answers[0]; 
      const latestAnswerB = b.answers[0];

      // compares latest answers between two questions, sorting the one answered most recently first
      if (!latestAnswerA || !latestAnswerB) {
        return 0; 
      } if ((latestAnswerB.ans_date_time) > latestAnswerA.ans_date_time) {
        return 1;
      }
      else if ((latestAnswerB.ans_date_time) < latestAnswerA.ans_date_time) {
        return -1;
      }
      else {
        return b.ask_date_time.getTime() - a.ask_date_time.getTime(); 
      }    
    });
  } else {
      // if not 'active' sortorder, simply returns the already filtered questions, sorted latest to oldest
      return sortQuestionsByDate(questions);
    }

  return questions;
};

/**
 * Helper function that sorts an array of questions(latest to oldest) using ask_date_time
 * @param questions an array of question objects
 * @returns a sorted array
 */
const sortQuestionsByDate = (questions: IQuestion[]) => {
  return questions.sort((a, b) => {
    return new Date(b.ask_date_time).getTime() - new Date(a.ask_date_time).getTime();
  });
};

/**
 * Helper function that sorts an array of answers(latest to oldest) using ans_date_time
 * @param answers an array of answer objects
 * @returns a sorted array
 */
function sortAnswersByDate(answers: IAnswer[]) {
  answers.sort((a, b) => {
    return new Date(b.ans_date_time).getTime() - new Date(a.ans_date_time).getTime();
  });
}

/**
 * A function to filter questions based on search string
 * @param qlist the list of questions to be filtered 
 * @param search the filter string
 * @returns the filtered list of questions
 */
const filterQuestionsBySearch = (qlist: IQuestion[] | undefined, search: string) => {

  if (!qlist) {
    return [];
  }
  const searchTerms = search.trim().split(/\s+/);
  const tags = searchTerms.filter(term => term.startsWith('[') && term.endsWith(']'));
  const keywords = searchTerms.filter(term => !term.startsWith('[') && !term.endsWith(']'));

  return qlist.filter(question => {
    if (!tags.length && !keywords.length) {
      return true; 
    }
    return isQuestionMatched(question, keywords, tags);
  });
};

/**
 * Helper function that compares uses keywords and tags to determine if a question object matches search
 * @param question a QuestionObject
 * @param keywords parsed keywords in search
 * @param tags parsed tag names 
 * @returns bool, true if matching, false otherwise
 */
const isQuestionMatched = (question: IQuestion, keywords: string[], tags: string[]): boolean => {
  return keywords.some(term => {
    return question.title.toLowerCase().includes(term.toLowerCase()) ||
           question.text.toLowerCase().includes(term.toLowerCase());
  }) || tags.some(term => {
    return question.tags.some(tag => tag.name.toLowerCase().includes(term.toLowerCase().slice(1, -1)));
  });
};

/**
 * Function that fetches a question by id and increments the views by 1
 * @param qid 
 * @returns a question object with the incremented views
 */
const fetchAndIncrementQuestionViewsById = async (qid: string): Promise<ErrorWrapped<IQuestion | null>> => {
  
  if (!qid || qid === '') {
    return { error: 'Error when fetching and updating a question' };
  }
    
  // populates answers
  const question = await Questions.findOneAndUpdate(
    { _id: qid },
    { $inc: { views: 1 } },
    { new: true }
  ).populate([
    { path: 'answers', model: Answers }
  ])

  return(question);
};

/**
 * saves a question to the database
 * @param q question object to save 
 * @returns the question object saved to the database 
 * or an object with an error message if the save failed
 * @throws an error if the question is invalid
 */
const saveQuestion = async (q: IQuestion): Promise<ErrorWrapped<IQuestion>> => {
  const tagObjects = await Promise.all(
    q.tags.map(async (tagObj) => {
      const existingTag = await Tags.findOne({ name: tagObj.name });
      if (existingTag) {
        return existingTag;
      } else {
        const newTag = new Tag({ name: tagObj.name });
        await newTag.save();
        return newTag;
      }
    })
  );

  q.tags = tagObjects;

  const newQuestion = await Questions.create(q);
  return newQuestion;
};

/**
 * saves an answer to the database
 * @param a answer object to save
 * @returns the answer object saved to the database
 * or an object with an error message if the save failed
 * @throws an error if the answer is invalid
 */
const saveAnswer = async (a: IAnswer): Promise<IAnswer> => {
  const newAnswer = await Answers.create(a);
  return newAnswer;
};

/**
 * retrieves tag ids from the database
 * @param tagNames a list of tag names
 * @returns returns a string array of tag ids
 * or empty array if the tag ids could not be retrieved
 */
const getTagIds = async (tagNames: string[]) => {
  const tagIds = [];
  for (const tagName of tagNames) {
    const tag = await Tags.findOne({ name: tagName });
    if (tag) {
      tagIds.push(tag._id.toString());
    }
  }
return tagIds;
};

/**
 * save an answer in the database, add the answer to the question, and update the question in the database
 * @param qid the question id
 * @param ans the answer object to be added
 * @returns the question object with the added answer or an object with an error message if the operation failed
 */
const addAnswerToQuestion = async (qid: string, ans: IAnswer): Promise<ErrorWrapped<IQuestion | null>> => {
  const newAnswer = new Answers(ans);
  await newAnswer.save();
  const question = await Questions.findByIdAndUpdate(qid, { $push: { answers: newAnswer._id } }, { new: true });
  return question;
};


/**
 * retrieves the question count of each tag in the database
 * @returns a map where the key is the tag name and the value is the count of questions with that tag
 */
const getTagCountMap = async (): Promise<ErrorWrapped<Map<string, number> | null>> => {

  const qlist = await Questions.find().populate({ path: 'tags', model: Tags });
  const tagCountMap = new Map<string, number>();
  const tagList = await Tags.find()
  
  tagList.map((t) => tagCountMap.set(t.name, 0)); 

  if (!qlist) {
    return tagCountMap;
  }

  for (const question of qlist) {
    for (const tag of question.tags) {
      const count = tagCountMap.get(tag.name) || 0;
      tagCountMap.set(tag.name, count + 1);
    }
  }

return tagCountMap;
};
    
export {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
  fetchAndIncrementQuestionViewsById,
  saveQuestion,
  getTagIds,
  saveAnswer,
  addAnswerToQuestion,
  getTagCountMap,
  registerUser,
  loginUser,
  getUserDetails,
  updateAnswer,
  deleteAnswer,
  removeAnswerFromQuestion,
}
