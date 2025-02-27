import { REACT_APP_API_URL, api } from "./config";
import {AnswerTypeI, AnswerResponseType } from "../types/entityTypes";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

/**
 *  Add a new answer to a question
 * @param qid   Question ID
 * @param ans   Answer object
 * @returns   Response object
 */
const addAnswer = async (
  qid: string,
  ans: AnswerTypeI
): Promise<AnswerResponseType> => {
  const data = { qid: qid, ans: ans };
  try {
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);
    if (res.status !== 200) {
      throw new Error("Error while creating a new answer");
    }
    return res.data;
  } catch (error) {
    console.error("Error adding answer:", error);
    throw error;
  }
};

/**
 * Update an existing answer
 * @param aid   Answer ID
 * @param text  New answer text
 * @returns   Response object
 */
const updateAnswer = async (aid: string, text: string) => {
  const data = { aid, text };
  try {
    const res = await api.post(`${ANSWER_API_URL}/updateAnswer`, data);
    if (res.status !== 200) {
      throw new Error("Error while updating answer");
    }
    return res.data;
  } catch (error) {
    console.error("Error updating answer:", error);
    throw error;
  }
};

/**
 * Delete an existing answer
 * @param aid   Answer ID
 * @param qid   Question ID
 * @returns   Response object
 */
const deleteAnswer = async (aid: string, qid: string) => {
  const data = { aid, qid };
  try {
    const res = await api.post(`${ANSWER_API_URL}/deleteAnswer`, data);
    if (res.status !== 200) {
      throw new Error("Error while deleting answer");
    }
    return res.data;
  } catch (error) {
    console.error("Error deleting answer:", error);
    throw error;
  }
};

export { addAnswer, updateAnswer, deleteAnswer };
