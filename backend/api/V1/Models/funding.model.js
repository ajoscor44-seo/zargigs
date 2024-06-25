import mongoose from "mongoose";
const Schema = mongoose.Schema;

const fundingSchema = new Schema(
  {
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
    order_id: {
      type: String,
      required: true,
    },
    trans_id: {
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
