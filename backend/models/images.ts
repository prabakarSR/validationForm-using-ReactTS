import mongoose, { Document, Schema } from "mongoose";

export interface IImage extends Document {
  image: string;
  uploadedBy: string; // this will store the username (or userId if you prefer)
}

const ImageSchema: Schema = new Schema({
  image: { type: String, required: true },
  uploadedBy: { type: String, required: true },
});

export default mongoose.model<IImage>("image", ImageSchema);
