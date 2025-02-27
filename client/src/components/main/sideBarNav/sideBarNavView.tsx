import "./sideBarNavView.css";
import { VoidFunctionType } from "../../../types/functionTypes";

interface SideBarNavProps {
  selected?: string;
  handleQuestions: VoidFunctionType;
  handleTags: VoidFunctionType;
}

/**
 * SideBarNav component for main page
 *  @param param0  selected: selected menu, handleQuestions: function to handle question menu click, handleTags: function to handle tag menu click
 * @returns       SideBarNav component
 *  */
const SideBarNav = ({
  selected = "",
  handleQuestions,
  handleTags,
}: SideBarNavProps) => {
  return (
    <div id="sideBarNav" className="sideBarNav">
      <div
        id="menu_question"
        className={`menu_button ${selected === "q" ? "menu_selected" : ""}`}
        onClick={() => {
          handleQuestions();
        }}
      >
        Questions
      </div>
      <div
        id="menu_tag"
        className={`menu_button ${selected === "t" ? "menu_selected" : ""}`}
        onClick={() => {
          handleTags();
        }}
      >
        Tags
      </div>
    </div>
  );
};

export default SideBarNav;
