import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id?: string;
  username: string;
  email: string;
  password: string;
}

export const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.set('toJSON', {
  transform: function(doc:any, ret: any) {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export default mongoose.model<IUser & mongoose.Document>("User", userSchema);
