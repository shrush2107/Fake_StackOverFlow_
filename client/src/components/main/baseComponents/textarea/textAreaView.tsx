import "../input/inputView.css";
import { StringFunctionType } from "../../../../types/functionTypes";

interface TextareaProps {
  title: string;
  mandatory?: boolean;
  hint?: string;
  id: string;
  val: string;
  setState: StringFunctionType;
  err?: string;
}

/**
 * Textarea component  to display a textarea input
 * @param title - string title of the textarea
 *  @param mandatory - boolean to indicate if the textarea is mandatory
 * @param hint - string hint to display below the textarea
 *  @param id - string id of the textarea
 * @param val - string value of the textarea
 *  @param setState - StringFunctionType function to set the state of the textarea
 * @param err - string error message to display
 * @returns
 * */
const Textarea = ({
  title,
  mandatory = true,
  hint,
  id,
  val,
  setState,
  err,
}: TextareaProps) => {
  return (
    <>
      <div className="input_title">
        {title}
        {mandatory ? "*" : ""}
      </div>
      {hint && <div className="input_hint">{hint}</div>}
      <textarea
        id={id}
        className="input_input"
        value={val}
        onChange={(e) => {
          setState(e.currentTarget.value);
        }}
      />
      {err && <div className="input_error">{err}</div>}
    </>
  );
};

export default Textarea;
