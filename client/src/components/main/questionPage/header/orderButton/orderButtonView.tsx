import "./orderButtonView.css";
import { MessageFunctionType } from "../../../../../types/functionTypes";

interface OrderButtonProps {
  message: string;
  setQuestionOrder: MessageFunctionType;
}

/**
 * OrderButton component
 * @param message - string message to display on the button
 * @param setQuestionOrder - MessageFunctionType function to set the question order
 * @returns
 * */
const OrderButton = ({ message, setQuestionOrder }: OrderButtonProps) => {
  return (
    <button
      className="btn"
      onClick={() => {
        setQuestionOrder(message);
      }}
    >
      {message}
    </button>
  );
};

export default OrderButton;
