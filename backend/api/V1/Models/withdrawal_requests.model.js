import mongoose from "mongoose";

const withdrawalRequestsSchema = new mongoose.Schema(
  {
    sn: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    charges: {
      type: Number,
      required: true,
    },
    withdrawalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "approved", "declined"],
    },
    bankDetails: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const WithdrawalRequests = mongoose.model(
  "WithdrawalRequests",
  withdrawalRequestsSchema
);

export default WithdrawalRequests;
