import React from "react";
import PageClass from ".";
import TagPage from "../tagPage/tagPageView";

/**
 * Class for the tag page
 */
export default class TagPageClass extends PageClass {
  getContent(): React.ReactNode {
    return (
      <TagPage
        clickTag={this.clickTag}
        handleNewQuestion={this.handleNewQuestion}
      />
    );
  }

  getSelected(): string {
    return "t";
  }
}
