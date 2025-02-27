import "./mainView.css";
import SideBarNav from "./sideBarNav/sideBarNavView";
import PageClass from "./routing";

interface MainProps {
  page: PageClass,
  handleQuestions: () => void,
  handleTags: () => void,
}

/**
 *  Main component that contains the sidebar and the main content
 * @param param0    page: PageClass, handleQuestions: () => void, handleTags: () => void
 * @returns      Main component
 */
const Main = ({ page, handleQuestions, handleTags }: MainProps) => {

  return (
    <div id="main" className="main">
      <SideBarNav
        selected={page.getSelected()}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
      />
      <div id="right_main" className="right_main">
        {page.getContent()}
      </div>
    </div>
  );
};

export default Main;
