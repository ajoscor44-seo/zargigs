import Notification from "../Models/notification.model.js";
import logger from "./logger.util.js";

export const sendNotitfication = async (notification) => {
  try {
    const newNotification = new Notification({
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: false,
    });

    return await newNotification.save();
  } catch (error) {
    return logger.error(error.message);
  }
};
