import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  phoneNo: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, },
  email: { type: String, lowercase: true },
  phoneNo: { type: String, },
  password: { type: String,},
});

export default mongoose.model<IUser>("user", UserSchema);
