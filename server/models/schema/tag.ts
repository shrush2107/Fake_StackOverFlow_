import mongoose from 'mongoose'

/**
 * Tag Schema is used to define the structure of the Tag collection in the MongoDB database.
 * @param name The name of the tag.
 * @param collection The name of the collection in the MongoDB database.
 */
const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }
  },
  { collection: 'Tag' }
)

export default TagSchema
