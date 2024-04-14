import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    createdBy: {
      type: String,
      ref: "user",
      required: true,
    },
    doneBy: {
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
    status: { type: String, required: false, default: "pending" },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600000 });

const PendingTask = mongoose.model("PendingTask", taskSchema);

export default PendingTask;
