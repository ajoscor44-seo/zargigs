import { notificationService } from "../services/supabaseDb.service.js";
import { supabase } from "../config/supabase.config.js";
import logger from "./logger.util.js";
import webpush from "web-push";

export const sendNotitfication = async (notification) => {
  try {
    return await notificationService.createNotification(
      notification.userId,
      notification.title,
      notification.message
    );
  } catch (error) {
    return logger.error(error.message);
  }
};

export const sendPushNotitfication = async (notification) => {
  try {
    const { data: subscriptions } = await supabase.from("subscriptions").select("*");
    if (!subscriptions || !subscriptions.length) return;

    Promise.all(
      subscriptions.map((sub) =>
        webpush.sendNotification(sub, JSON.stringify(notification))
      )
    )
      .then(() => logger.info("Notification sent successfully."))
      .catch(() => logger.error("Error sending notification"));
  } catch (error) {
    return logger.error(error.message);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    const subscriptionData = req.body;
    const userId = req.user.id || req.user._id;

    const { data: validSubscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (validSubscription) {
      return res.status(200).json({
        message: "You have already subscribed for push notification",
      });
    }

    await supabase.from("subscriptions").insert({
      user_id: userId,
      plan_name: "push_notification",
      amount: 0,
      status: "active",
      expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
    });

    return res.status(201).json({
      message: "You have successfully subscribed for push notification",
    });
  } catch (error) {
    next(error);
  }
};

export const sendPushNotification = async (notification) => {
  return await sendPushNotitfication(notification);
};
