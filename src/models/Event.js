import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  date: { type: Date, required: [true, "Please add a date"] },
  admins: [
    {
      type: [mongoose.Schema.ObjectId],
      ref: "User",
      required: [true, "Please add an admin to your event!"],
    },
  ],
  invitedUsers: [
    {
      type: [mongoose.Schema.ObjectId],
      ref: "User",
      required: [true, "Please invite users to your event!"],
    },
  ],
  acceptedUsers: [{ type: [mongoose.Schema.ObjectId], ref: "User" }],
  location: [
    {
      type: [mongoose.Schema.ObjectId],
      ref: "Location",
      required: [true, "Please add a location"],
    },
  ],
  komyuniti: [
    {
      type: [mongoose.Schema.ObjectId],
      ref: "User",
      required: [true, "Please add a Komyuniti"],
    },
  ],
});

export default mongoose.model("Event", eventSchema);
