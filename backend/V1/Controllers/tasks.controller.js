import AdvertTask from "../Models/advertTask.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const getAdvertTasks = async (req, res, next) => {
  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  const advertTasks = await AdvertTask.find({});
  res.status(200).json(advertTasks);
  next();
};

export const postAdvertTask = async (req, res, next) => {
  const {
    taskType,
    gender,
    location,
    religion,
    caption,
    mediaUrl,
    numberOfTasks,
    costPerTask,
    taskPlatform,
  } = req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  // Create new advert task
  const newAdvertTask = new AdvertTask({
    createdBy: req.user._id,
    taskType,
    taskPlatform,
    gender,
    location,
    religion,
    caption,
    mediaUrl,
    numberOfTasks,
    allocatedTasks: 0,
    completedTasks: 0,
    costPerTask,
    status: "pending",
  });
  await newAdvertTask.save(); // Saves new advert task

  res.status(200).json({
    status: 200,
    failed: true,
    message: "Advert Created successfully.",
  });

  next();
};
