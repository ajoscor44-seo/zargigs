import mongoose from "mongoose";
const Schema = mongoose.Schema;

const fundingSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    paidOn: {
      type: Date,
      required: true,
      default: new Date(),
    },
    paymentGateway: {
      type: String,
      default: "Autocredit",
    },
    paymentMethod: {
      type: String,
      default: "ACCOUNT_TRANSFER",
    },
    status: {
      type: String,
      required: true,
      env: ["PENDING", "PAID", "DECLINED"],
    },
    orderId: {
      type: String,
    },
    transReference: {
      type: String,
      required: true,
    },
    paymentReference: {
      type: String,
      required: true,
    },
    sourceAccountNumber: {
      type: String,
      required: true,
    },
    sourceAccountName: {
      type: String,
      required: true,
    },
    sourceBankName: {
      type: String,
      required: true,
    },
    settlementAmount: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    paymentDescription: {
      type: String,
      required: true,
    },
    walletReference: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Funding = mongoose.model("Funding", fundingSchema);

export default Funding;
