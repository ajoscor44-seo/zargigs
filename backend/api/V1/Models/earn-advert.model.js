import mongoose from "mongoose";

const earnAdvertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    platformName: {
      type: String,
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
    whatTheyDo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EarnAdvert = mongoose.model("EarnAdvert", earnAdvertSchema);

export default EarnAdvert;
