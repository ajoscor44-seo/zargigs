import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    createdBy: {
      type: String,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      required: true,
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
      type: Array,
      required: false,
      default: 0,
    },
    completedTasks: {
      type: Array,
      required: false,
      default: 0,
    },
    taskCost: {
      type: Boolean,
      required: true,
    },
    status: { type: Number, required: true, default: "pending" },
  },
  {
    timestamps: true,
  }
);

const AdvertTask = mongoose.model("AdvertTask", taskSchema);

export default AdvertTask;
