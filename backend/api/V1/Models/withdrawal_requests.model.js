import mongoose from "mongoose";

const withdrawalRequestsSchema = new mongoose.Schema(
  {
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
      env: ["pending", "approved", "declined"],
    },
  },
  { timestamps: true }
);

const WithdrawalRequests = mongoose.model(
  "WithdrawalRequests",
  withdrawalRequestsSchema
);

export default WithdrawalRequests;
