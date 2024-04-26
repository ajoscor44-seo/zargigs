import mongoose from "mongoose";

const recentActivitySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userLocation: {
      type: Object,
      required: true,
    },
    amountEarned: {
      type: Number,
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
  },
  { timestamps: true }
);

const RecentActivity = mongoose.model("RecentActivity", recentActivitySchema);

export default RecentActivity;
