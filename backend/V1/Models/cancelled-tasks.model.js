import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    parentId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      ref: "user",
      required: true,
    },
    cancelledBy: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    taskPlatform: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    earningPerTask: {
      type: Number,
      required: true,
    },
    status: { type: String, required: false, default: "cancelled" },
  },
  {
    timestamps: true,
  }
);

const CancelledTask = mongoose.model("CancelledTask", taskSchema);

export default CancelledTask;
