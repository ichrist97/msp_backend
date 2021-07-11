import mongoose from "mongoose";
import geocoder from "../utils/geocoder";

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: new Date(), required: true },
    date: { type: Date, required: true },
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    // invitedUsers: [
    //   {
    //     type: [mongoose.Schema.ObjectId],
    //     ref: "User",
    //     // required: [true, "Please invite users to your event!"],
    //   },
    // ],
    // acceptedUsers: [{ type: [mongoose.Schema.ObjectId], ref: "User" }],
    address: {
      type: String,
      // required: [true, "Please add an address"],
    },
    location: [
      {
        // GeoJSON Point
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number],
          index: "2dsphere",
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
      },
    ],
    komyuniti: {
      type: mongoose.Schema.ObjectId,
      ref: "Komyuniti",
    },
  },
  { timestamps: true }
);

// Geocode & create location field
EventSchema.pre("save", async function (next) {
  if (!this.isModified("address") || this.address == null) {
    next();
  }
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do not save address in DB
  //this.address = undefined;
  next();
});

// always populate friends of a user
const autoPopulateKomyuniti = function (next) {
  this.populate("komyuniti");
  next();
};

EventSchema.pre("findOne", autoPopulateKomyuniti)
  .pre("find", autoPopulateKomyuniti)
  .pre("findById", autoPopulateKomyuniti)
  .post("save", function (doc, next) {
    doc.populate("komyuniti").execPopulate(function () {
      next();
    });
  });

// always populate friends of a user
const autoPopulateMembers = function (next) {
  this.populate("members");
  next();
};

EventSchema.pre("findOne", autoPopulateMembers)
  .pre("find", autoPopulateMembers)
  .pre("findById", autoPopulateMembers)
  .post("save", function (doc, next) {
    doc.populate("members").execPopulate(function () {
      next();
    });
  });

// always admin user
const autoPopulateAdmin = function (next) {
  this.populate("admin");
  next();
};

EventSchema.pre("findOne", autoPopulateAdmin)
  .pre("find", autoPopulateAdmin)
  .pre("findById", autoPopulateAdmin)
  .post("save", function (doc, next) {
    doc.populate("admin").execPopulate(function () {
      next();
    });
  });

export default mongoose.model("Event", EventSchema);
