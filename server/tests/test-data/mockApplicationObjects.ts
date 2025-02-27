import { IAnswer, IQuestion, ITag } from "../../models/types/types";

/**
 * This file contains sample data objects used for testing the application module.
 */

export const _tag1: ITag = {
    _id: '507f191e810c19729de860ea',
    name: 'react'
  };
  
  export const _tag2: ITag = {
    _id: '65e9a5c2b26199dbcc3e6dc8',
    name: 'javascript'
  };
  
  export const _tag3: ITag = {
    _id: '65e9b4b1766fca9451cba653',
    name: 'android'
  };
  
  export const _ans1: IAnswer = {
    _id: '65e9b58910afe6e94fc6e6dc',
    text: 'ans1',
    ans_by: 'ans_by1',
    ans_date_time: new Date('2023-11-18T09:24:00')
  };
  
  export const _ans2: IAnswer = {
    _id: '65e9b58910afe6e94fc6e6dd',
    text: 'ans2',
    ans_by: 'ans_by2',
    ans_date_time: new Date('2023-11-20T09:24:00')
  };
  
  export const _ans3: IAnswer = {
    _id: '65e9b58910afe6e94fc6e6de',
    text: 'ans3',
    ans_by: 'ans_by3',
    ans_date_time: new Date('2023-11-19T09:24:00')
  };
  
  export const _ans4: IAnswer = {
    _id: '65e9b58910afe6e94fc6e6df',
    text: 'ans4',
    ans_by: 'ans_by4',
    ans_date_time: new Date('2023-11-19T09:24:00')
  };
  
  export const _questions: IQuestion[] = [
    {
      _id: '65e9b58910afe6e94fc6e6dc',
      title: 'Quick question about storage on android',
      text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
      tags: [_tag3, _tag2],
      answers: [_ans1, _ans2],
      ask_date_time: new Date('2023-11-16T09:24:00'),
      views: 48,
      votes: []
    },
    {
      _id: '65e9b5a995b6c7045a30d823',
      title: 'Object storage for a web application',
      text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
      tags: [_tag1, _tag2],
      answers: [_ans1, _ans2, _ans3],
      ask_date_time: new Date('2023-11-17T09:24:00'),
      views: 34,
      votes: []
    },
    {
      _id: '65e9b9b44c052f0a08ecade0',
      title: 'Is there a language to write programmes by pictures?',
      text: 'Does something like that exist?',
      tags: [],
      answers: [],
      ask_date_time: new Date('2023-11-19T09:24:00'),
      views: 12,
      votes: []
    },
    {
      _id: '65e9b716ff0e892116b2de09',
      title: 'Unanswered Question #2',
      text: 'Does something like that exist?',
      tags: [],
      answers: [],
      ask_date_time: new Date('2023-11-20T09:24:00'),
      views: 233,
      votes: []
    },
  ];
  
  export const mockQuestionWithVoteId = '64162a1688a39d70851c56ab';
  
  export const mockQuestionWithVote: IQuestion = {
    _id: '64162a1688a39d70851c56ab',
    title: 'Test Question',
    text: 'This is a test question.',
    tags: [],
    answers: [],
    asked_by: 'testasker',
    ask_date_time: new Date(),
    views: 0,
    votes: ['testuser'],
  };
  
  export const mockQuestionWithoutVoteId = '64162a1688a39d70851c56ac';
  
  export const mockQuestionWithoutVote: IQuestion = {
    _id: '64162a1688a39d70851c56ac',
    title: 'Test Question',
    text: 'This is a test question.',
    tags: [],
    answers: [],
    asked_by: 'testasker',
    ask_date_time: new Date(),
    views: 0,
    votes: [],
  };