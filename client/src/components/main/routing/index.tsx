import {
  PageSetterFunctionType,
  ClickTagFunctionType,
  IdFunctionType,
  VoidFunctionType,
  OrderFunctionType,
} from "../../../types/functionTypes";
export interface PageClassProps {
  search: string;
  title: string;
  setQuestionPage: PageSetterFunctionType;
  questionOrder: string;
  setQuestionOrder: OrderFunctionType;
  qid: string;
  handleQuestions: VoidFunctionType;
  handleTags: VoidFunctionType;
  handleAnswer: IdFunctionType;
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
  handleSignUp: VoidFunctionType;
  handleLogin: VoidFunctionType;
  handleProfile: VoidFunctionType;
}

class PageClass {
  search: string;
  title: string;
  setQuestionPage: PageSetterFunctionType;
  questionOrder: string;
  setQuestionOrder: OrderFunctionType;
  qid: string;
  handleQuestions: VoidFunctionType;
  handleTags: VoidFunctionType;
  handleAnswer: IdFunctionType;
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
  handleSignUp: VoidFunctionType;
  handeLogin: VoidFunctionType;
  handleProfile: VoidFunctionType;

  constructor(props: PageClassProps) {
    this.search = props.search;
    this.title = props.title;
    this.setQuestionPage = props.setQuestionPage;
    this.questionOrder = props.questionOrder;
    this.setQuestionOrder = props.setQuestionOrder;
    this.qid = props.qid;
    this.handleQuestions = props.handleQuestions;
    this.handleTags = props.handleTags;
    this.handleAnswer = props.handleAnswer;
    this.clickTag = props.clickTag;
    this.handleNewQuestion = props.handleNewQuestion;
    this.handleNewAnswer = props.handleNewAnswer;
    this.handleSignUp = props.handleSignUp;
    this.handeLogin = props.handleLogin;
    this.handleProfile = props.handleProfile;
  }

  getContent(): React.ReactNode {
    return null;
  }

  getSelected(): string {
    return "";
  }
}

export default PageClass;
