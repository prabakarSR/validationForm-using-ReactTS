import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  phoneNo: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phoneNo: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("user", UserSchema);
