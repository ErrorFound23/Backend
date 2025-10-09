import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"; // is bearer token
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    }, // index makes field searchable(optimaize way)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: { type: String, required: true, trim: true, index: true },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: { type: String, required: [true, "Password is required"] },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// => hash password using bcrypt.hash method
// avoid arrow function because arrow function does't have this context.
userSchema.pre("save", async function (next) {
  // avoid update(hash) a password every time when any document field was modified
  // or
  //  create a hash password only when new user password assign, modified or update.
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

// custom methods
// => compare user login and database stored encrypted password.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id, // from mongodb
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// refresh token store less info then access token
userSchema.methods.generateRefreshToken = function () {
  jwt.sign(
    {
      _id: this._id, 
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
