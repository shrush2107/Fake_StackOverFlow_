import { useEffect, useState } from "react";
import { getQuestionsByFilter } from "../services/questionService";
import { QuestionResponseType } from "../types/entityTypes";

interface UseQuestionPageProps {
  order: string;
  search: string;
}

/**
 * Custom hook to handle question page
 * @param order   Order of questions
 * @param search  Search string
 * @returns       Object containing questions
 */
export const useQuestionPage = ({ order, search }: UseQuestionPageProps) => {
  const [qlist, setQlist] = useState<QuestionResponseType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionsByFilter(order, search);
        setQlist(res || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  }, [order, search]);

  return { qlist };
};
