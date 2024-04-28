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
    title: {
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
    status: { type: String, required: false, default: "in-review" },
  },
  {
    timestamps: true,
  }
);

const InReviewTask = mongoose.model("InReviewTask", taskSchema);

export default InReviewTask;
