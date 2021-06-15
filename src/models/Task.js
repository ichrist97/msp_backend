import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add a user to your task!"],
    },
    event: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
      required: [true, "Please add an event to your task!"],
    },
    createdAt: { type: Date, default: Date.now },
    title: { type: String, required: [true, "Please add a title"] },
    description: { type: String },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"] },
    done: { type: Boolean, required: [true, "Please set status of task"] },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
