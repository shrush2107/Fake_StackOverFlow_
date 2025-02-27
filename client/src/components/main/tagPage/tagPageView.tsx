import "./tagPageView.css";
import Tag from "./tag/tagView";
import { useTagPage } from "../../../hooks/useTagPage";
import {
  VoidFunctionType,
  ClickTagFunctionType,
} from "../../../types/functionTypes";
import  { useContext } from "react";
import { UserContext } from "../../../UserContext";
import { toast } from "react-toastify";
interface TagPageProps {
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 * TagPage component displays all tags and the number of tags
 * @param param0    clickTag: function to handle tag click
 * @returns      TagPage component
 */
const TagPage = ({ clickTag, handleNewQuestion }: TagPageProps) => {
  const { tlist } = useTagPage();
  const { user } = useContext(UserContext);
  return (
    <>
      <div className="space_between right_padding">
        <div className="bold_title">{tlist.length} Tags</div>
        <div className="bold_title">All Tags</div>
        <button
          className="bluebtn"
          onClick={() => {
            if (user) {
              handleNewQuestion();
            } 
            if (!user) {
             toast.error("You must be logged in to ask a question")
            }
            }}
            //disabled={!user}
          >
            Ask a Question
        </button>
      </div>
      <div className="tag_list right_padding">
        {tlist.map((t, idx) => (
          <Tag key={idx} t={t} clickTag={clickTag} />
        ))}
      </div>
    </>
  );
};

export default TagPage;
