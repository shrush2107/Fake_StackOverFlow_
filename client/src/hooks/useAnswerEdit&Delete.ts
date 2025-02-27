import { useState } from 'react';
import { updateAnswer, deleteAnswer } from '../services/answerService';

/**
 *  Manages the editing of an answer
 * @param aid   The id of the answer
 * @param initialText     The initial text of the answer
 * @param refreshQuestion   A function to refresh the question
 * @returns        An object with the editing state, a function to set the editing state, the answer text, a function to set the answer text, and a function to save the answer
 */
export const useAnswerEdit = (aid: string, initialText: string, refreshQuestion: () => void) => {
  const [editing, setEditing] = useState(false);
  const [answerText, setAnswerText] = useState(initialText);

  const handleSave = async () => {
    try {
      await updateAnswer(aid, answerText);
      setEditing(false);
      refreshQuestion();
    } catch (err) {
      console.error("Error saving answer:", err);
    }
  };

  return {
    editing,
    setEditing,
    answerText,
    setAnswerText,
    handleSave
  };
};

/**
 * Manages the deletion of an answer
 *  @param aid   The id of the answer
 *  @param qid   The id of the question
 *  @param refreshQuestion   A function to refresh the question
 * @returns   A function to delete the answer
  */
export const useAnswerDelete = (aid: string, qid: string, refreshQuestion: () => void) => {
  const handleDelete = async () => {
    try {
      await deleteAnswer(aid, qid);
      refreshQuestion();
    } catch (err) {
      console.error("Error deleting answer:", err);
    }
  };

  return handleDelete;
};