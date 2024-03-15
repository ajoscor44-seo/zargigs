import mongoose from "mongoose";

const accessTokenSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const accessToken = mongoose.model("accessToken", accessTokenSchema);

export default accessToken;
