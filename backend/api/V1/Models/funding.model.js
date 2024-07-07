import mongoose from "mongoose";
const Schema = mongoose.Schema;

const fundingSchema = new Schema(
  {
    userId: {
      type: String,
    },
    paidOn: {
      type: Date,
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
      env: ["PENDING", "PAID", "DECLINED"],
    },
    orderId: {
      type: String,
    },
    transReference: {
      type: String,
    },
    paymentReference: {
      type: String,
    },
    sourceAccountNumber: {
      type: String,
    },
    sourceAccountName: {
      type: String,
    },
    sourceBankName: {
      type: String,
      default: "Monicredit",
    },
    settlementAmount: {
      type: Number,
    },
    amountPaid: {
      type: Number,
    },
    paymentDescription: {
      type: String,
    },
    walletReference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Funding = mongoose.model("Funding", fundingSchema);

export default Funding;
