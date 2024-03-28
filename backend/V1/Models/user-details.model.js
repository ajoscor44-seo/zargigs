import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
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
