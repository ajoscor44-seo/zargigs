import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
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

const userDetails = mongoose.model("UserDetail", userDetailsSchema);

export default userDetails;
