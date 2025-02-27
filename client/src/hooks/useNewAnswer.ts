import { useState } from "react";
import { validateHyperlink } from "../tool";
import { addAnswer } from "../services/answerService";
import { QuestionIdFunctionType } from "../types/functionTypes";

/**
 * Hook to handle new answer creation
 * @param qid   Question ID
 * @param handleAnswer  Function to handle answer
 * @returns   text, setText, textErr, postAnswer
 */
export const useNewAnswer = (
  qid: string,
  handleAnswer: QuestionIdFunctionType
) => {
  const [text, setText] = useState<string>("");
  const [textErr, setTextErr] = useState<string>("");

  const postAnswer = async () => {
    let isValid = true;

    if (!text) {
      setTextErr("Answer text cannot be empty");
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const answer = {
      text: text,
      ans_date_time: new Date(),
    };

    const res = await addAnswer(qid, answer);
    if (res && res._id) {
      handleAnswer(qid);
    }
  };

  return {
    text,
    setText,
    textErr,
    postAnswer,
  };
};
