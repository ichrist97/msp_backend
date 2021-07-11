import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.ObjectId, ref: "Event", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

// always populate user of chatmessage
const autoPopulateUser = function (next) {
  this.populate("user");
  next();
};

// always populate user of chatmessage
const autoPopulateEvent = function (next) {
  this.populate("event");
  next();
};

msgSchema
  .pre("findOne", autoPopulateUser)
  .pre("find", autoPopulateUser)
  .pre("findById", autoPopulateUser)
  .post("save", function (doc, next) {
    doc.populate("user").execPopulate(function () {
      next();
    });
  });

msgSchema
  .pre("findOne", autoPopulateEvent)
  .pre("find", autoPopulateEvent)
  .pre("findById", autoPopulateEvent)
  .post("save", function (doc, next) {
    doc.populate("event").execPopulate(function () {
      next();
    });
  });

export default mongoose.model("ChatMessage", msgSchema);
