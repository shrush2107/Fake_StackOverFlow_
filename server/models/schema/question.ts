import mongoose from 'mongoose'
/**
 * Question Schema is a schema for the question model
 * @param title: string
 * @param text: string
 *  @param asked_by: string
 *  @param ask_date_time: Date
 *  @param views: number
 *  @param tags: array of objects
 *  @param answers: array of objects
 * @param votes: array of strings
 * @returns QuestionSchema
 */
const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String, 
    required: true
  },
  asked_by: {
    type: String,
    required: true
  },
  ask_date_time: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    name: {
      type: String,
      required: true
    }
  }],
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }],

  votes: [{ type: String }] 
}, 
{ collection: 'Question' });

export default QuestionSchema
