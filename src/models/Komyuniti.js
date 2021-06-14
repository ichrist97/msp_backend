import mongoose from "mongoose";

const komyunitiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  members: [{ type: mongoose.Schema.ObjectId, ref: "User", required: true }],
  admins: [{ type: [mongoose.Schema.ObjectId], ref: "User", required: true }],
});

export default mongoose.model("Komyuniti", komyunitiSchema);
