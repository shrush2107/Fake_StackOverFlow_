import "./headerView.css";
import { VoidFunctionType } from "../../../../types/functionTypes";
import  { useContext } from "react";
import { UserContext } from "../../../../UserContext";
import { toast } from "react-toastify";
interface AnswerHeaderProps {
  ansCount: number;
  title: string;
  handleNewQuestion: VoidFunctionType;
}

/**
 * AnswerHeader component     
 * @param ansCount: number of answers
 * @param title: string question title
 * @param handleNewQuestion: function to handle new question
 * @returns AnswerHeader component
 * */
const AnswerHeader = ({
  ansCount,
  title,
  handleNewQuestion,
}: AnswerHeaderProps) => {
  const { user } = useContext(UserContext);
  return (
    <div id="answersHeader" className="space_between right_padding">
      <div className="bold_title">{ansCount} answers</div>
      <div className="bold_title answer_question_title">{title}</div>
      <button
          className="bluebtn"
          onClick={() => {
            if (user) {
              handleNewQuestion();
            } 
            if(!user) {
             toast.error("You must be logged in to ask a question")
            }
            }}
          >
            Ask a Question
        </button>
    </div>
  );
};

export default AnswerHeader;
