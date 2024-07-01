import Notification from "../Models/notification.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Notification.countDocuments({
      userId: req.user._id,
    });
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      data: notifications,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const postNotifications = async (req, res, next) => {
  try {
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

    return res
      .status(200)
      .json({ status: 200, failed: true, message: "Notification Sent." });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.query;

    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    // MArks notification as read
    await Notification.findByIdAndUpdate(id, { read: true });

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getUnRead = async (req, res, next) => {
  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    // Gets unread notifications
    const totalUnreads = await Notification.countDocuments({
      read: false,
      userId: req.user._id,
    });

    return res.status(200).json({ unreads: totalUnreads });
  } catch (error) {
    next(error);
  }
};
