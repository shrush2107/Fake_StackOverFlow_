import "./inputView.css";
import { StringFunctionType } from "../../../../types/functionTypes";

interface InputProps {
  title: string;
  hint?: string;
  id: string;
  mandatory?: boolean;
  val: string;
  setState: StringFunctionType;
  err?: string;
}

/**
 *  Input component for the form 
 * @param title - title of the input
 *  @param hint - hint for the input
 * @param id - id of the input
 *  @param mandatory - if the input is mandatory
 * @param val - value of the input
 * @param setState - function to set the value of the input
 *  @param err - error message for the input
 * @returns - Input component
 *  */
const Input = ({
  title,
  hint,
  id,
  mandatory = true,
  val,
  setState,
  err,
}: InputProps) => {
  return (
    <>
      <div className="input_title">
        {title}
        {mandatory ? "*" : ""}
      </div>
      {hint && <div className="input_hint">{hint}</div>}
      <input
        id={id}
        className="input_input"
        type="text"
        value={val}
        onInput={(e) => {
          setState(e.currentTarget.value);
        }}
      />
      {err && <div className="input_error">{err}</div>}
    </>
  );
};

export default Input;
