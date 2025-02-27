import "./newAnswerView.css";
import Form from "../baseComponents/form/formView";
import Textarea from "../baseComponents/textarea/textAreaView";
import { useNewAnswer } from "../../../hooks/useNewAnswer";
import { QuestionIdFunctionType } from "../../../types/functionTypes";

interface NewAnswerProps {
  qid: string;
  handleAnswer: QuestionIdFunctionType;
}

/**
 *  NewAnswer component to post a new answer
 *  @param qid - string question id
 *  @param handleAnswer - QuestionIdFunctionType function to handle answers
 * @returns
 * */
const NewAnswer = ({ qid, handleAnswer }: NewAnswerProps) => {
  const { 
    text, 
    setText, 
    textErr, 
    postAnswer } =
    useNewAnswer(qid, handleAnswer);

  return (
    <Form>
      <Textarea
        title={"Answer Text"}
        id={"answerTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <div className="btn_indicator_container">
        <button className="form_postBtn" onClick={postAnswer}>
          Post Answer
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswer;
