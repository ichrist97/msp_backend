import { Schema } from "mongoose";
import mongoose from "mongoose";

const PostSchema = new Schema({
  name: String,
});

export default mongoose.model("Post", PostSchema);
