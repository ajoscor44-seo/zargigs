import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    religion: {
      type: String,
      required: false,
    },
    location: {
      type: Object,
      required: false,
    },
    dateOfBirth: {
      type: Object,
      required: false,
    },
    bankDetails: {
      type: Object,
      required: false,
    },
    userEarnings: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("UserDetail", userSchema);

export default User;
