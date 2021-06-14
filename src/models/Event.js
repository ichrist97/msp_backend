import mongoose from "mongoose";
import geocoder from "../utils/geocoder";

const EventSchema = new mongoose.Schema(
  {
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
    address: {
      type: String,
      required: [true, "Please add an address"],
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
    komyuniti: [
      {
        type: [mongoose.Schema.ObjectId],
        ref: "User",
        required: [true, "Please add a Komyuniti"],
      },
    ],
  },
  { timestamps: true }
);

// Geocode & create location field
EventSchema.pre("save", async function (next) {
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
  this.address = undefined;
  next();
});

export default mongoose.model("Event", EventSchema);
