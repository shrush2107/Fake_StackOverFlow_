import { REACT_APP_API_URL, api } from "./config";
import { QuestionType, QuestionResponseType } from "../types/entityTypes";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

/**
 * Get questions by filter
 * @param order   Order of questions
 * @param search  Search query
 * @returns       QuestionResponseType[]
 */
const getQuestionsByFilter = async (
  order = "newest",
  search = ""
): Promise<QuestionResponseType[]> => {
  try {
    const res = await api.get(
      `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );
    if (res.status !== 200) {
      throw new Error("Error when fetching or filtering questions");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

/**
 * Get question by id
 * @param qid  Question id
 * @returns    QuestionResponseType
 */
const getQuestionById = async (qid: string): Promise<QuestionResponseType> => {
  try {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);
    if (res.status !== 200) {
      throw new Error("Error when fetching question by id");
    }
    return res.data;
  } catch (error) {
    console.error(`Error fetching question ${qid}:`, error);
    throw error;
  }
};

/**
 * Add a new question
 * @param q  Question data
 * @returns   QuestionResponseType
 * @throws    Error
 */
const addQuestion = async (q: QuestionType): Promise<QuestionResponseType> => {
  try {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);
    if (res.status !== 200) {
      throw new Error("Error while creating a new question");
    }

    return res.data;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};


/*
  * Upvote a question
  * @param questionId  Question id
  * @returns           Message
  * @throws            Error
  */
const upvoteQuestion = async (questionId: string): Promise<{ message: string }> => {
  try {
    const response = await api.post(`${QUESTION_API_URL}/${questionId}/upvote`);
    return response.data;
  } catch (error) {
    console.error("Error upvoting question:", error);
    throw error;
  }
};

/**
 * Downvote a question
 *  @param questionId  Question id
 * @returns           Message
 * @throws            Error
 * */
const downvoteQuestion = async (questionId: string): Promise<{ message: string }> => {
  try {
    const response = await api.post(`${QUESTION_API_URL}/${questionId}/downvote`);
    return response.data;
  } catch (error) {
    console.error("Error downvoting question:", error);
    throw error;
  }
};


export { getQuestionsByFilter, getQuestionById, addQuestion, upvoteQuestion, downvoteQuestion };
