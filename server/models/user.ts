import mongoose from 'mongoose'
import { IUser } from './types/types'
import UserSchema from './schema/user'

// Create a model for the answers based on AnswerSchema
const User = mongoose.model<IUser>('User', UserSchema)

export default User
