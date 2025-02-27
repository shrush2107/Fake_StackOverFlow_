// src/hooks/useVote.ts
import { useState, useEffect, useContext } from 'react';
import { upvoteQuestion, downvoteQuestion } from "../services/questionService";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";

interface UseVoteProps {
  questionId: string;
  initialVotes?: string[];
}

/**
 * Custom hook to handle voting
 * @param questionId   Id of the question
 * @param initialVotes   Initial votes of the question
 * @returns              Object containing voting status and functions to handle voting
 */
const useVote = ({ questionId, initialVotes = [] }: UseVoteProps) => {
  const { user } = useContext(UserContext);
  const [voted, setVoted] = useState<boolean>(false);
  const [votesCount, setVotesCount] = useState<number>(initialVotes.length);

  useEffect(() => {
    setVotesCount(initialVotes.length);
    if (user && initialVotes.includes(user.username)) {
      setVoted(true);
    } else {
      setVoted(false);
    }
  }, [initialVotes, user]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.warning("You need to Login to Vote!");
      return;
    }
    try {
      await upvoteQuestion(questionId);
      setVoted(true);
      setVotesCount(prev => prev + 1);
    } catch (error) {
      console.error("Error upvoting question:", error);
      toast.error("Failed to upvote. Please try again.");
    }
  };

  const handleDownvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.warning("You need to Login to Vote!");
      return;
    }
    try {
      await downvoteQuestion(questionId);
      setVoted(false);
      setVotesCount(prev => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Error downvoting question:", error);
      toast.error("Failed to downvote. Please try again.");
    }
  };

  return {
    voted,
    votesCount,
    handleUpvote,
    handleDownvote,
  };
};

export default useVote;
