import mongoose from "mongoose";

const KomyunitiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name for your Komyuniti!"],
    },
    createdAt: { type: Date, default: new Date() },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Please add a member!"],
      },
    ],
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add an admin!"],
    },
  },
  { timestamps: true }
);

// Cascade delete Events when a Komyuniti is deleted
KomyunitiSchema.pre("remove", async function (next) {
  // TODO: cascading delete of events
  next();
});

// always populate friends of a user
const autoPopulateMembers = function (next) {
  this.populate("members");
  next();
};

KomyunitiSchema.pre("findOne", autoPopulateMembers)
  .pre("find", autoPopulateMembers)
  .pre("findById", autoPopulateMembers)
  .post("save", function (doc, next) {
    doc.populate("members").execPopulate(function () {
      next();
    });
  });

// always populate friends of a user
const autoPopulateAdmin = function (next) {
  this.populate("admin");
  next();
};

KomyunitiSchema.pre("findOne", autoPopulateAdmin)
  .pre("find", autoPopulateAdmin)
  .pre("findById", autoPopulateAdmin)
  .post("save", function (doc, next) {
    doc.populate("admin").execPopulate(function () {
      next();
    });
  });

export default mongoose.model("Komyuniti", KomyunitiSchema);
