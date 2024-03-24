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
    referrals: {
      type: Array,
      required: false,
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
    image: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
