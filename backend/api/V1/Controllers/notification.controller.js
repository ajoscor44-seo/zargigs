import Notification from "../Models/notification.model.js";
import User from "../Models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { ErrorHandler } from "../utils/error.js";

export const getNotifications = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  const notifications = await Notification.find()
    .skip((page - 1) * limit)
    .limit(limit);

  const totalCount = await Notification.countDocuments();
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    data: notifications,
    meta: {
      total: totalCount,
      pages: totalPages,
    },
  });
  next();
};

export const postNotifications = async (req, res, next) => {
  const { title, type, message } = req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  const newNotification = new Notification({
    userId: req.user._id,
    title,
    type,
    read: false,
    message,
  });
  await newNotification.save();

  const receiverSocketId = getReceiverSocketId(req.user._id);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newNotification", newNotification);
  }

  res
    .status(200)
    .json({ status: 200, failed: true, message: "Notification Sent." });

  next();
};
