import "./questionPageView.css";
import QuestionHeader from "./header/headerView";
import Question from "./question/questionView";
import { useQuestionPage } from "../../../hooks/useQuestionPage";
import {
  ClickTagFunctionType,
  VoidFunctionType,
  IdFunctionType,
  OrderFunctionType,
} from "../../../types/functionTypes";

export interface QuestionPageProps {
  title_text?: string;
  order: string;
  search: string;
  setQuestionOrder: OrderFunctionType;
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 * QuestionPage component for main page
 *  @param param0  title_text: title text, order: question order, search: search keyword, setQuestionOrder: function to set question order, clickTag: function to handle tag click, handleAnswer: function to handle answer click, handleNewQuestion: function to handle new question click
 *  @returns       QuestionPage component
 * */
const QuestionPage = ({
  title_text = "All Questions",
  order,
  search,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
}: QuestionPageProps) => {
  const { qlist } = useQuestionPage({ order, search });

  return (
    <>
      <QuestionHeader
        title_text={title_text}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <div id="question_list" className="question_list">
        {qlist.map((q, idx) => (
          <Question
            q={q}
            key={idx}
            clickTag={clickTag}
            handleAnswer={handleAnswer}
          />
        ))}
      </div>
      {title_text === "Search Results" && !qlist.length && (
        <div className="bold_title right_padding">No Questions Found</div>
      )}
    </>
  );
};

export default QuestionPage;
