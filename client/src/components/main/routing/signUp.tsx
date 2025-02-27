import React from "react";
import PageClass from ".";
import SignUp from "../../header/authentication/SignUp";

/**
 * Class for the sign up page
 */
export default class SignUpPageClass extends PageClass {
  getContent(): React.ReactNode {
    console.log(this);
    return <SignUp handleQuestions={this.handleQuestions} />;
  }

  getSelected(): string {
    return "";
  }
}
