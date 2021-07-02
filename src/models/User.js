import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import geocoder from "../utils/geocoder";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "please add an email"],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  // gets passed via user input
  address: {
    type: String,
  },
  friends: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  // gets generated via code
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
  role: {
    type: String,
    enum: ["ADMIN", "MEMBER", "GUEST"],
    default: "MEMBER",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: 5,
    //dont show password when returning a user model instance
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//encrypt password with bcrypt
UserSchema.pre("save", async function (next) {
  // if the user password is not modified just call next middleware
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);

  //hash password with salt
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// sign JWT and return
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

// formate user
UserSchema.methods.format = function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
};

//match user password from request to hashed password in db
UserSchema.methods.matchPassword = async function (requestPassword) {
  return await bcrypt.compare(requestPassword, this.password);
};

// Geocode & create location field
UserSchema.pre("save", async function (next) {
  if (!this.isModified("address")) {
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
  this.address = undefined;
  next();
});

// always populate friends of a user
var autoPopulateFriends = function (next) {
  this.populate("friends");
  next();
};

UserSchema.pre("findOne", autoPopulateFriends)
  .pre("find", autoPopulateFriends)
  .pre("findById", autoPopulateFriends)
  .post("save", function (doc, next) {
    doc.populate("friends").execPopulate(function () {
      next();
    });
  });

export default mongoose.model("User", UserSchema);
