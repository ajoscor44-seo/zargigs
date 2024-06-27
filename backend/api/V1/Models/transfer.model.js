import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    senderUsername: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    receiverUsername: {
      type: String,
      required: true,
    },
    amountSent: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "failed", "successful"],
    },
  },
  { timestamps: true }
);

const Transfer = mongoose.model("Transfer", transferSchema);

export default Transfer;
