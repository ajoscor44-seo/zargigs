import { supabase } from "../config/supabase.config.js";

export const getRecentActivities = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    const formatted = (data || []).map((item) => ({
      id: item.id,
      _id: item.id,
      title: item.title,
      message: item.message,
      createdAt: item.created_at,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

export const postRecentActivities = async (req, res, next) => {
  try {
    return res
      .status(200)
      .json({ status: 200, failed: false, message: "Recent Activity Added" });
  } catch (error) {
    next(error);
  }
};
