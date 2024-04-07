import RecentActivity from "../Models/recent-activity.model.js";
import User from "../Models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { ErrorHandler } from "../utils/error.js";

export const getRecentActivities = async (req, res, next) => {
  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  const recentActivities = await RecentActivity.find({});
  res.status(200).json(recentActivities);
  next();
};

export const postRecentActivities = async (req, res, next) => {
  const {
    category,
    username,
    userLocation,
    amountEarned,
    taskType,
    taskPlatform,
  } = req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  const newRecentActivity = new RecentActivity({
    taskType,
    username,
    userLocation,
    amountEarned,
    taskPlatform,
    category,
  });
  await newRecentActivity.save();

  const receiverSocketId = getReceiverSocketId(req.user._id);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newRecentActivity", newRecentActivity);
  }

  res
    .status(200)
    .json({ status: 200, failed: false, message: "Recent Activity Added" });

  next();
};
