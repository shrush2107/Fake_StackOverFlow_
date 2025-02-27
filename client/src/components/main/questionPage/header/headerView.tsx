import "./headerView.css";
import OrderButton from "./orderButton/orderButtonView";
import {
  VoidFunctionType,
  MessageFunctionType,
} from "../../../../types/functionTypes";
import  { useContext } from "react";
import { UserContext } from "../../../../UserContext";
import { toast } from "react-toastify";

interface QuestionHeaderProps {
  title_text: string;
  qcnt: number;
  setQuestionOrder: MessageFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 *  QuestionHeader component for question page
 *  @param param0  title_text: title text, qcnt: question count, setQuestionOrder: function to set question order, handleNewQuestion: function to handle new question click
 * @returns       QuestionHeader component
 *  */
const QuestionHeader = ({
  title_text,
  qcnt,
  setQuestionOrder,
  handleNewQuestion,
}: QuestionHeaderProps) => {
  const { user } = useContext(UserContext);
  return (
    <div>
      <div className="space_between right_padding">
        <div className="bold_title">{title_text}</div>
        <button
          className="bluebtn"
          onClick={() => {
            if (user) {
              handleNewQuestion();
            } 
            if (!user) {
              toast.error("You must be logged in to ask a question");
            }
            }}
            //disabled={!user}
          >
            Ask a Question
        </button>
      </div>
      <div className="space_between right_padding">
        <div id="question_count">{qcnt} questions</div>
        <div className="btns">
          {["Newest", "Active", "Unanswered"].map((m, idx) => (
            <OrderButton
              key={idx}
              message={m}
              setQuestionOrder={setQuestionOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
