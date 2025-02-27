import { IQuestion } from "../../models/types/types";

/**
 * This file contains sample data objects used for testing the question controller routes. 
 */

export const tag1 = {
    _id: '507f191e810c19729de860ea',
    name: 'tag1'
  };
export const tag2 = {
_id: '65e9a5c2b26199dbcc3e6dc8',
name: 'tag2'
};

export const ans1 = {
_id: '65e9b58910afe6e94fc6e6dc',
text: 'Answer 1 Text',
ans_by: 'answer1_user',
ans_date_time: new Date('2024-06-09T12:00:00Z')
};

export const ans2 = {
_id: '65e9b58910afe6e94fc6e6dd',
text: 'Answer 2 Text',
ans_by: 'answer2_user',
ans_date_time: new Date('2024-06-10T12:00:00Z')
};

export const ans3 = {
_id: '65e9b58910afe6e94fc6e6df',
text: 'Answer 3 Text',
ans_by: 'answer3_user',
ans_date_time: new Date('2024-06-11T12:00:00Z')
};

export const ans4 = {
_id: '65e9b58910afe6e94fc6e6dg',
text: 'Answer 4 Text',
ans_by: 'answer4_user',
ans_date_time: new Date('2024-06-14T12:00:00Z')
};

export const mockQuestions: IQuestion[] = [
{
    _id: '65e9b58910afe6e94fc6e6dc',
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [ans1],
    asked_by: 'question1_user',
    ask_date_time: new Date('2024-06-03T12:00:00Z'),
    views: 10,
    votes: []
},
{
    _id: '65e9b5a995b6c7045a30d823',
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2, ans3],
    asked_by: 'question2_user',
    ask_date_time: new Date('2024-06-04T12:00:00Z'),
    views: 20,
    votes: []
},

{
    _id: '34e9b58910afe6e94fc6e99f',
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [tag1, tag2],
    answers: [ans4],
    asked_by: 'question3_user',
    ask_date_time: new Date('2024-06-03T12:00:00Z'),
    views: 101,
    votes: []
},
{
    _id: '78f0c123456789abcdef012345',
    title: 'Question 4 Title - Long Question with Many Answers',
    text: 'This is a very long question with a lot of text. It might even exceed the character limit for a typical question. It will have many answers and tags to test how the API handles larger amounts of data.',
    tags: [tag1, tag2, { _id: 'anotherTagId', name: 'tag3' }],
    answers: [ans1, ans2, ans3, ans4, {
    _id: 'anotherAnswerId',
    text: 'Another Answer Text',
    ans_by: 'anotherAnswerUser',
    ans_date_time: new Date('2024-06-15T12:00:00Z')
    }],
    asked_by: 'question4_user',
    ask_date_time: new Date('2024-06-01T12:00:00Z'),
    views: 5,
    votes: []
},
{
    _id: '9ab1def4567890abcdef012345',
    title: 'Question 5 Title - No Answers',
    text: 'This question has no answers yet.',
    tags: [],
    answers: [],
    asked_by: 'question5_user',
    ask_date_time: new Date('2024-06-10T12:00:00Z'),
    views: 150,
    votes: []
}
];