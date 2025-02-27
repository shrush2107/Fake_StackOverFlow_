import "./tagView.css";
import { ClickTagFunctionType } from "../../../../types/functionTypes";

interface TagProps {
  t: {
    name: string;
    qcnt: number;
  };
  clickTag: ClickTagFunctionType;
}

/**
 *  Tag component for tag page
 * @param param0  t: tag object, clickTag: function to handle tag click
 * @returns       Tag component
 */
const Tag = ({ t, clickTag }: TagProps) => {
  return (
    <div
      className="tagNode"
      onClick={() => {
        clickTag(t.name);
      }}
    >
      <div className="tagName">{t.name}</div>
      <div>{t.qcnt} questions</div>
    </div>
  );
};

export default Tag;
