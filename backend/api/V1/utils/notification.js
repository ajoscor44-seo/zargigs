import Notification from "../Models/notification.model.js";
import Subscription from "../Models/subscription.model.js";
import logger from "./logger.util.js";
import webpush from "web-push";

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

export const sendPushNotitfication = async (notification) => {
  try {
    const subscriptions = Subscription.find({});

    Promise.all(
      subscriptions.map((subscription) =>
        webpush.sendNotification(subscription, JSON.stringify(notification))
      )
    )
      .then(() => logger.info("Notification sent successfully."))
      .catch((err) => {
        logger.error("Error sending notification");
      });
  } catch (error) {
    return logger.error(error.message);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    const subscriptionData = req.body;

    const subscription = new Subscription({
      endpoint: subscriptionData.endpoint,
      expirationTime: subscriptionData.expirationTime,
      keys: {
        p256dh: subscriptionData.keys.p256dh,
        auth: subscriptionData.keys.auth,
      },
      userId: req.user._id,
    });
    await subscription.save();

    return res.status(201).json({
      message: "You have successfully subscribed for push notification",
    });
  } catch (error) {
    next(error);
  }
};

export const sendPushNotification = async (notification) => {
  try {
    const subscriptions = await Subscription.find({});

    const payload = JSON.stringify(notification);

    subscriptions.forEach((subscription) => {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      };

      webpush
        .sendNotification(pushSubscription, payload)
        .catch((error) => console.error("Error sending notification:", error));
    });
  } catch (error) {
    return logger.error(error.message);
  }
};
