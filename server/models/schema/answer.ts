import mongoose from 'mongoose'

/**
 * Answer Schema  -  This schema is used to store the answer of the question.
 * @text: This field is used to store the answer of the question.
 *  @ans_by: This field is used to store the user who answered the question.
 *  @ans_date_time: This field is used to store the date and time when the answer was posted.
 * @collection: This field is used to store the name of the collection in the database.
 * @return: Returns the Answer Schema.
 * 
 */
const AnswerSchema = new mongoose.Schema(
  {  
    text: {
      type: String,
      required: true
    },

    ans_by: {
      type: String,
      required: true
    },

    ans_date_time: {
      type: Date,
      required: true
    }
  }, { collection: 'Answer' }
)

export default AnswerSchema
