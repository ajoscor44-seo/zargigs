import mongoose from "mongoose";

const accessTokenSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
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

const AccessToken = mongoose.model("accessToken", accessTokenSchema);

export default AccessToken;
