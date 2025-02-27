// src/components/Question.tsx
import "./questionView.css";
import { getMetaData } from "../../../../tool";
import {
  ClickTagFunctionType,
  IdFunctionType,
} from "../../../../types/functionTypes";
import { Tag, AnswerType } from "../../../../types/entityTypes";
import useVote from "../../../../hooks/useVote"; // Import the custom hook
import { useContext } from "react";
import { UserContext } from "../../../../UserContext";

interface QuestionProps {
  q: {
    _id: string;
    answers: AnswerType[];
    views: number;
    title: string;
    tags: Tag[];
    asked_by: string;
    ask_date_time: string;
    votes?: string[]; // Ensure the type includes upvotes
  };
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
}

/**
 *  Question component for question page
 *    @param param0  q: question object, clickTag: function to handle tag click, handleAnswer: function to handle answer click
 *  @returns   Question component
 * */ 
const Question = ({ q, clickTag, handleAnswer }: QuestionProps) => {
  const user = useContext(UserContext);
  // Utilize the custom useVote hook
  const { voted, votesCount, handleUpvote, handleDownvote } = useVote({
    questionId: q._id,
    initialVotes: q.votes,
  });

  return (
    <div
      className="question right_padding"
      onClick={() => {
        handleAnswer(q._id);
      }}
    >
      <div className="postStats">
        <div>{q.answers.length || 0} answers</div>
        <div>{q.views} views</div>
      </div>
      <div className="question_mid">
        <div className="postTitle">{q.title}</div>
        <div className="question_tags">
          {q.tags.map((tag, idx) => (
            <button
              key={idx}
              className="question_tag_button"
              onClick={(e) => {
                e.stopPropagation();
                clickTag(tag.name);
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
      <div className="lastActivity">
        <div className="question_author">{q.asked_by}</div>
        <div>&nbsp;</div>
        <div className="question_meta">
          asked {getMetaData(new Date(q.ask_date_time))}
        </div>
      </div>
      {/* Upvote Section */}
      <div className="upvote_section" onClick={(e) => e.stopPropagation()}>
        <span className="upvote_count">{votesCount}</span>
        {!user ? (
          <button className="vote_button" onClick={handleUpvote}>Upvote</button>
        ) : !voted ? (
          <button className="vote_button" onClick={handleUpvote}>Upvote</button>
        ) : (
          <button className="vote_button" onClick={handleDownvote}>Downvote</button>
        )}
      </div>
    </div>
  );
};

export default Question;
