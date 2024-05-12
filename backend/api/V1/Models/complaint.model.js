import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    createdBy: {
      type: String,
      required: true,
    },
    complaint: {
      type: String,
      required: true,
    },
    screenshot: {
      type: String,
    },
    isResolved: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("complaint", complaintSchema);

export default Complaint;
