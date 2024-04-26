import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
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
      default: "engagement",
    },
    taskPlatform: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    religion: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    numberOfTasks: {
      type: Number,
      required: true,
    },
    allocatedTasks: {
      type: Number,
      required: false,
      default: 0,
    },
    completedTasks: {
      type: Number,
      required: false,
      default: 0,
    },
    costPerTask: {
      type: Number,
      required: true,
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

const EngagementTask = mongoose.model("EngagementTask", taskSchema);

export default EngagementTask;
