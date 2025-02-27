import { Schema } from "mongoose";
import { IUser} from "../types/types";
/**
 * User Schema is a schema for the user model
 * @param username: string
 * @param email: string
 *  @param password: string
 * @param aboutme: string
 *  @param linkedInLink: string
 * @returns UserSchema
 */
const UserSchema: Schema<IUser> = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        aboutme: { type: String, default:null},
        linkedInLink: { type: String, default:null},
    },
    { collection: "User" }
);
export default UserSchema
