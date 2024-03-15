import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      unique: false,
    },
    lastname: {
      type: String,
      required: true,
      unique: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: false,
    },
    referredBy: {
      type: String,
      required: true,
      unique: false,
    },
    role: {
      type: String,
      required: true,
      unique: false,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      unique: false,
    },
    isMember: {
      type: Boolean,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
