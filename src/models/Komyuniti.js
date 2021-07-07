import mongoose from "mongoose";

const KomyunitiSchema = new mongoose.Schema(
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
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Please add an admin!"],
      },
    ],
  },
  { timestamps: true }
);

// Cascade delete Events when a Komyuniti is deleted
KomyunitiSchema.pre("remove", async function (next) {
  console.log(`Events being removed from Komyuniti ${this._id}`);
  await this.model("Event").deleteMany({ komyuniti: this._id });
  next();
});

export default mongoose.model("Komyuniti", KomyunitiSchema);
