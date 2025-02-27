import { useEffect, useState } from "react";
import { getQuestionById } from "../services/questionService";
import { QuestionResponseType } from "../types/entityTypes";
import { useCallback } from "react";

/**
 * Fetches a question by its id
 * @param qid   The id of the question
 * @returns   The question and a function to refetch the question
 */
export const useAnswerPage = (qid: string) => {
  const [question, setQuestion] = useState<QuestionResponseType | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await getQuestionById(qid);
      setQuestion(res || null);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  }, [qid]);

  useEffect(() => {
    fetchData();
  }, [qid, fetchData]);

  return { question, refreshQuestion: fetchData };
};

