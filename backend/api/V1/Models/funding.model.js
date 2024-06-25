import mongoose from "mongoose";
const Schema = mongoose.Schema;

const fundingSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: new Date(),
    },
    amount: {
      type: Number,
      required: true,
    },
    payment_gateway: {
      type: String,
      default: "Autocredit",
    },
    payment_method: {
      type: String,
      default: "Bank transfer",
    },
    status: {
      type: String,
      required: true,
      env: ["pending", "approved", "declined"],
    },
    orderId: {
      type: String,
      required: true,
    },
    transId: {
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
