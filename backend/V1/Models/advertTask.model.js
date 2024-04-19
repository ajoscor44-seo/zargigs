import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    createdBy: {
      type: String,
      ref: "user",
      required: true,
    },
    taskType: {
      type: String,
      required: true,
      default: "advert",
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
    caption: {
      type: String,
      required: false,
    },
    mediaUrl: {
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

const AdvertTask = mongoose.model("AdvertTask", taskSchema);

export default AdvertTask;
