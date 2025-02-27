import React from "react";
import PageClass from ".";
import Profile from "../../header/profile";

/**
 * Profile page class
 */
export default class ProfilePageClass extends PageClass {
  getContent(): React.ReactNode {
    console.log(this);
    return <Profile/>;
  }

  getSelected(): string {
    return "";
  }
}
