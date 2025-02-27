import { REACT_APP_API_URL, api } from "./config";
import { TagResponseType } from "../types/entityTypes";

const TAG_API_URL = `${REACT_APP_API_URL}/tag`;

/**
 * Fetches all tags with the number of questions associated with each tag
 * @returns {Promise<TagResponseType[]>} - A promise that resolves to an array of TagResponseType objects 
 * @throws {Error} - An error is thrown if the request fails
 */
const getTagsWithQuestionNumber = async (): Promise<TagResponseType[]> => {
  try {
    const res = await api.get(`${TAG_API_URL}/getTagsWithQuestionNumber`);
    if (res.status !== 200) {
      throw new Error("Error when fetching tags with question number");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

export { getTagsWithQuestionNumber };
