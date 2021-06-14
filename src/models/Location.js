import mongoose from "mongoose";

export const locationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    country: { type: String },
    city: { type: String },
    postalCode: { type: Number },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);
