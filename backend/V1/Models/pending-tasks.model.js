import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    allocationId: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      ref: "user",
      required: true,
    },
    toBeDoneBy: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    title: {
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
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 1 * 60 * 60 * 1000),
    },
    status: { type: String, required: false, default: "pending" },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
// Returns the time left before expiry as part of the data
taskSchema.methods.timeLeftInSeconds = function () {
  const now = new Date();
  return (this.expiresAt.getTime() - now.getTime()) / 1000;
};

const PendingTask = mongoose.model("PendingTask", taskSchema);

export default PendingTask;
