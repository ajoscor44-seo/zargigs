import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    createdBy: {
      type: String,
      required: true,
    },
    appName: {
      type: String,
      required: true,
      default: "Gigsflix",
    },
    membershipFee: {
      type: Number,
      required: true,
      default: 1000,
    },
    withdrawalCharges: {
      type: Number,
      required: true,
      default: 10,
    },
    minimumFollowers: {
      type: String,
      required: true,
      default: 1000,
    },
    appLogo: {
      type: String,
      required: true,
      default: "",
    },
    businessMail: {
      type: String,
      required: true,
      default: "gigsflixtechnologies@gmail.com",
    },
    fundingAccount: {
      type: Object({
        accountNumber: { type: String, required: true },
        accountName: { type: String, required: true },
        bankName: { type: String, required: true },
      }),
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
