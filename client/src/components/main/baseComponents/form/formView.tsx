import React, { ReactNode } from "react";
import "./formView.css";

interface FormProps {
  children: ReactNode;
}

/**
 * Form component for the form
 * @param children - children of the form
 * @returns - Form component
 */
const Form: React.FC<FormProps> = ({ children }) => {
  return <div className="form">{children}</div>;
};

export default Form;
