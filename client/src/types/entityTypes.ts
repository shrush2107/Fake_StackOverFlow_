interface AnswerType {
  _id: string;
  text: string;
  ans_by: string;
  ans_date_time: Date;
}
interface AnswerResponseType {
  ans_by: string;
  ans_date_time: string;
  text: string;
  _id: string;
}
interface AnswerTypeI{
  text: string;
  ans_date_time: Date;
}

interface QuestionType {
  title: string;
  text: string;
  tags: Tag[];
  ask_date_time: Date;
}

interface QuestionResponseType {
  _id: string;
  answers: AnswerType[];
  views: number;
  title: string;
  tags: { name: string }[];
  asked_by: string;
  ask_date_time: string;
  text: string;
  votes: string[];
}

interface Question {
  answers: {
    text: string;
    ans_by: string;
    ans_date_time: string;
  }[];
  title: string;
  views: number;
  text: string;
  asked_by: string;
  ask_date_time: string;
  votes: string[];
}

interface Tag {
  name: string;
}

interface TagResponseType {
  name: string;
  _id: string;
  qcnt: number;
}

interface UserType{
  username: string;
  email: string;
  password: string;
  aboutme: string;
  linkedInLink: string;
}

interface UserResponseType{
  username: string;
  email: string;
  password: string;
  _id: string;
  aboutme: string;  
  linkedInLink: string;
}

interface User{
  username: string;
  email: string;
  password: string;   
  aboutme: string;  
  linkedInLink: string;
}

interface SignupResponseType {
  success: boolean;
  message: string;
  user?: UserResponseType;
  token?: string;
}

interface LoginData {
  emailOrUsername: string;
  password: string;
}

interface LoginResponseType {
  success: boolean;
  message: string;
  user?: UserResponseType;
  token?: string;
}


export type {
  AnswerType,
  AnswerTypeI,
  QuestionType,
  Question,
  Tag,
  AnswerResponseType,
  QuestionResponseType,
  TagResponseType,
  UserType,
  UserResponseType,
  User,
  SignupResponseType,
  LoginData,
  LoginResponseType,
};
