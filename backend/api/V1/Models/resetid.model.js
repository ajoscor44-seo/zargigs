import mongoose from "mongoose";

const resetIdSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    resetId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ResetId = mongoose.model("resetId", resetIdSchema);

export default ResetId;
