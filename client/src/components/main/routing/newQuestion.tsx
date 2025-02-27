import React from "react";
import PageClass from ".";
import NewQuestion from "../newQuestion/newQuestionView";

/**
 * Class for the New Question Page
 */
export default class NewQuestionPageClass extends PageClass {
  getContent(): React.ReactNode {
    console.log(this);
    return <NewQuestion handleQuestions={this.handleQuestions} />;
  }

  getSelected(): string {
    return "";
  }
}
