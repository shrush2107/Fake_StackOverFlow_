import { useContext } from "react";
import { UserContext } from "../../../../UserContext";
import { handleHyperlink } from "../../../../tool";
import { useAnswerEdit,useAnswerDelete } from "../../../../hooks/useAnswerEdit&Delete";
import "./answerView.css";

interface AnswerProps {
  aid: string;
  qid: string;
  text: string;
  ansBy: string;
  meta: string;
  refreshQuestion: () => void;
}

/**
 * Answer component that displays the answer text, author, and metadata.
 * Allows the user to edit or delete their own answers.
 * @param aid - answer id
 * @param qid - question id
 * @param text - answer text
 * @param ansBy - answer author
 * @param meta - answer metadata
 * @param refreshQuestion - function to refresh the question page
 * @returns - Answer component
 *  */
const Answer = ({ aid, qid, text, ansBy, meta, refreshQuestion }: AnswerProps) => {
  const { user } = useContext(UserContext);
  const { editing, setEditing, answerText, setAnswerText, handleSave } = useAnswerEdit(aid, text, refreshQuestion);
  const handleDelete = useAnswerDelete(aid, qid, refreshQuestion);

  return (
    <div className="answer right_padding">
      {editing ? (
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className="edit-answer-textarea"
        />
      ) : (
        <div id="answerText" className="answerText">
          {handleHyperlink(text)}
        </div>
      )}

      {user?.username === ansBy && !editing && (
        <button className="edit_button" onClick={() => setEditing(true)}>Edit</button>
      )}
      {editing && <button className="save_button" onClick={handleSave}>Save</button>}
      {editing && (
        <button className="cancel_button"
          onClick={() => {
            setEditing(false);
            setAnswerText(text);
          }}
        >
          Cancel
        </button>
      )}
      {user?.username === ansBy && !editing && <button className="delete_button" onClick={handleDelete}>Delete</button>}

      <div className="answerAuthor">
        <div className="answer_author">{ansBy}</div>
        <div className="answer_question_meta">{meta}</div>
      </div>
    </div>
  );
};

export default Answer;
