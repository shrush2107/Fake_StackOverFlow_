import { useState } from "react";
import Header from "./header";
import Main from "./main/mainView";
import HomePageClass from "./main/routing/home";
import TagPageClass from "./main/routing/tag";
import AnswerPageClass from "./main/routing/answer";
import NewQuestionPageClass from "./main/routing/newQuestion";
import NewAnswerPageClass from "./main/routing/newAnswer";
import SignUpPageClass from "./main/routing/signUp";
import LoginPageClass from "./main/routing/login";
import ProfilePageClass from "./main/routing/profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * FakeStackOverflow component
 * @returns FakeStackOverflow component
 */
const FakeStackOverflow = () => {
  const [search, setSearch] = useState<string>("");
  const [mainTitle, setMainTitle] = useState<string>("All Questions");
  const [questionOrder, setQuestionOrder] = useState("newest");
  const [qid, setQid] = useState("");

  const setQuestionPage = (
    search = "",
    title = "All Questions"
  ): void => {
    setSearch(search);
    setMainTitle(title);
    setPageInstance(
      new HomePageClass({
        search,
        title,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        handleSignUp,
        handleLogin,
        handleProfile,
      })
    );
  };

  const handleQuestions = () => {
    setSearch("");
    setMainTitle("All Questions");
    setPageInstance(
      new HomePageClass({
        search: "",
        title: "All Questions",
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        handleSignUp,
        handleLogin,
        handleProfile,
      })
    );
  };

  const handleTags = () => {
    setPageInstance(
      new TagPageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        handleSignUp,
        handleLogin,
        handleProfile,
      })
    );
  };

  const handleAnswer = (qid: string) => {
    setQid(qid);
    setPageInstance(
      new AnswerPageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        handleSignUp,
        handleLogin,
        handleProfile,
      })
    );
  };

  const clickTag = (tname: string) => {
    setSearch("[" + tname + "]");
    setMainTitle(tname);
    setPageInstance(
      new HomePageClass({
        search: "[" + tname + "]",
        title: tname,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        handleSignUp,
        handleLogin,
        handleProfile,
      })
    );
  };

  const handleNewQuestion = () => {
    setPageInstance(
      new NewQuestionPageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        handleSignUp,
        handleLogin,
        handleProfile,
      })
    );
  };

  const handleNewAnswer = () => {
    setPageInstance(
      new NewAnswerPageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        handleSignUp,
        handleLogin,
        handleProfile,
      })
    );
  };

  
  const handleSignUp = () => {
    setPageInstance(
      new SignUpPageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        handleSignUp,
        handleLogin,
        handleProfile,
      })
    );
  };

  const handleLogin = () => {
    setPageInstance(
      new LoginPageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        handleSignUp,
        handleLogin,
        handleProfile,
      })
    );
  };

  const handleProfile = () => {
    setPageInstance(
      new ProfilePageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        handleSignUp,
        handleLogin,
        handleProfile,
      })
    );
  };

  const [pageInstance, setPageInstance] = useState(new HomePageClass({
      search: "",
      title: "All Questions",
      setQuestionPage,
      questionOrder,
      setQuestionOrder,
      qid,
      handleQuestions,
      handleTags,
      handleAnswer,
      clickTag,
      handleNewQuestion,
      handleNewAnswer,
      handleSignUp,
      handleLogin,
      handleProfile,
    })
  );

  console.log("Before: ", pageInstance);
  pageInstance.search = search;
  pageInstance.questionOrder = questionOrder;
  pageInstance.qid = qid;
  pageInstance.title = mainTitle;
  console.log("After: ", pageInstance);

  return (
    <>
      <Header 
        search={search} 
        setQuestionPage={setQuestionPage} 
        handleSignUp={handleSignUp}
        handleLogin={handleLogin}
        handleProfile={handleProfile}
        />
      <Main 
        page={pageInstance} 
        handleQuestions={handleQuestions} handleTags={handleTags}
      />
      <ToastContainer />
    </>
  );
};

export default FakeStackOverflow;
