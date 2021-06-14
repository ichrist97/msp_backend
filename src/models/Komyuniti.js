import mongoose from "mongoose";

const komyunitiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name for your Komyuniti!"],
    },
    createdAt: { type: Date, default: Date.now },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Please add a member!"],
      },
    ],
    admins: [
      {
        type: [mongoose.Schema.ObjectId],
        ref: "User",
        required: [true, "Please add an admin!"],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Komyuniti", komyunitiSchema);
