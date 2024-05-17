import mongoose from "mongoose";

const createAdvertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    platformName: {
      type: String,
      required: true,
    },
    amountToPay: {
      type: Number,
      required: true,
    },
    amountToEarn: {
      type: Number,
      required: true,
    },
    pathToPage: {
      type: String,
      required: true,
    },
    platforms: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CreateAdvert = mongoose.model("CreateAdvert", createAdvertSchema);

export default CreateAdvert;
