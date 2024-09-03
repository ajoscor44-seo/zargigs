import Notification from "../Models/notification.model.js";
import Subscription from "../Models/subscription.model.js";
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

export const subscribe = async (req, res, next) => {
  try {
    const subscription = { userId: req.user._id, ...req.body };
    await Subscription.create(subscription);

    res.status(201).json({});
  } catch (error) {
    logger.error("Error saving notification subscription");
  }
};

export const sendPushNotification = async (notification) => {
  try {
    const subscriptions = await Subscription.find({});

    const payload = JSON.stringify({
      title: `${notification.title}`,
      body: `${notification.body}`,
    });

    subscriptions.forEach((subscription) => {
      webPush
        .sendNotification(subscription, payload)
        .catch((error) => console.error("Error sending notification:", error));
    });
  } catch (error) {
    return logger.error(error.message);
  }
};
