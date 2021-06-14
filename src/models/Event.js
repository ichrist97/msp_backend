import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now, required: true },
  date: { type: Date, required: true },
  admins: [{ type: [mongoose.Schema.ObjectId], ref: "User", required: true }],
  invitedUsers: [
    { type: [mongoose.Schema.ObjectId], ref: "User", required: true },
  ],
  acceptedUsers: [
    { type: [mongoose.Schema.ObjectId], ref: "User", required: true },
  ],
  location: [
    { type: [mongoose.Schema.ObjectId], ref: "Location", required: true },
  ],
  komyuniti: [
    { type: [mongoose.Schema.ObjectId], ref: "User", required: true },
  ],
});

export default mongoose.model("Event", eventSchema);
