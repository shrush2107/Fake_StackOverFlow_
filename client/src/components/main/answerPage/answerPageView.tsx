import { getMetaData } from "../../../tool";
import Answer from "./answer/answerView";
import AnswerHeader from "./header/headerView";
import "./answerPageView.css";
import QuestionBody from "./questionBody/questionBodyView";
import { VoidFunctionType } from "../../../types/functionTypes";
import { useAnswerPage } from "../../../hooks/useAnswerPage";
import  { useContext } from "react";
import { UserContext } from "../../../UserContext";
import { toast } from "react-toastify";

interface AnswerPageProps {
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
}

/**
 * AnswerPage component
 * @param qid - question id
 *  @param handleNewQuestion - function to handle new question
 * @param handleNewAnswer - function to handle new answer
 *  @returns - AnswerPage component
  */
const AnswerPage = ({
  qid,
  handleNewQuestion,
  handleNewAnswer,
}: AnswerPageProps) => {
  const { user } = useContext(UserContext);
  const { question, refreshQuestion } = useAnswerPage(qid);

  if (!question) {
    return null;
  }

  return (
    <>
      <AnswerHeader
        ansCount={question.answers.length}
        title={question.title}
        handleNewQuestion={handleNewQuestion}
      />
      <QuestionBody
        views={question.views}
        text={question.text}
        askby={question.asked_by}
        meta={getMetaData(new Date(question.ask_date_time))}
      />
      {question.answers.map((a, idx) => (
      <Answer
        key={idx}
        aid={a._id}
        qid={qid}
        text={a.text}
        ansBy={a.ans_by}
        meta={getMetaData(new Date(a.ans_date_time))}
        refreshQuestion={refreshQuestion}
      />
    ))}
      <button
          className="bluebtn ansButton"
          onClick={() => {
            if (user) {
              handleNewAnswer();
            } 
            if (!user) {
              toast.error("You must be logged in to answer a question");
            }
            }}
            //disabled={!user}
          >
            Answer Question
        </button>
    </>
  );
};

export default AnswerPage;
