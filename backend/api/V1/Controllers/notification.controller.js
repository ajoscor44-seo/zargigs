import { notificationService } from "../services/supabaseDb.service.js";
import { supabase } from "../config/supabase.config.js";
import { ErrorHandler } from "../utils/error.js";

export const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const userId = req.user.id || req.user._id;

    const { data: notifications, count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const formatted = (notifications || []).map((n) => ({
      id: n.id,
      _id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.message,
      read: n.is_read,
      createdAt: n.created_at,
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      data: formatted,
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
    const { title, message } = req.body;
    const userId = req.user.id || req.user._id;

    await notificationService.createNotification(userId, title, message);

    return res
      .status(200)
      .json({ status: 200, failed: false, message: "Notification Sent." });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.query;
    await notificationService.markAsRead(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getUnRead = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) throw error;

    return res.status(200).json({ unreads: count || 0 });
  } catch (error) {
    next(error);
  }
};
