import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    postedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Advertisement = mongoose.model("advertisement", advertisementSchema);

export default Advertisement;
