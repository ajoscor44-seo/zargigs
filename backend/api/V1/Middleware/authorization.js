import { supabase } from "../config/supabase.config.js";

const authorizeAdmin = async (req, res, next) => {
  try {
    // 1. If role is already attached to req.user and is admin
    if (req.user && req.user.role === "admin") {
      return next();
    }

    // 2. Extract user ID from req.user, auth headers, query, or body
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.sub ||
      req.headers?.["x-user-id"] ||
      req.headers?.["user-id"] ||
      req.query?.userId ||
      req.body?.userId;

    if (userId) {
      const { data: user, error } = await supabase
        .from("users")
        .select("id, role, username")
        .eq("id", userId)
        .maybeSingle();

      if (user && user.role === "admin") {
        if (!req.user) req.user = {};
        req.user.id = user.id;
        req.user._id = user.id;
        req.user.role = "admin";
        req.user.username = user.username;
        return next();
      }
    }

    return res.status(403).json({
      failed: true,
      message: "Access denied!. You do not have access to this endpoint.",
    });
  } catch (err) {
    console.error("authorizeAdmin error:", err);
    return res.status(403).json({
      failed: true,
      message: "Access denied!. You do not have access to this endpoint.",
    });
  }
};

export default authorizeAdmin;
