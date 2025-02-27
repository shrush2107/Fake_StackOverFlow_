import React from "react";
import PageClass from ".";
import Login from "../../header/authentication/Login";

/**
 * Class for the Login page
 */
export default class LoginPageClass extends PageClass {
  getContent(): React.ReactNode {
    console.log(this);
    return <Login handleQuestions={this.handleQuestions} />;
  }

  getSelected(): string {
    return "";
  }
}
