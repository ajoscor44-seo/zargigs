import { notificationService } from "../services/supabaseDb.service.js";
import { supabase } from "../config/supabase.config.js";
import { ErrorHandler } from "../utils/error.js";
import { sendNotitfication } from "../utils/notification.js";

export const postComplaint = async (req, res, next) => {
  const { complaint, proof } = req.body;
  const userId = req.user.id || req.user._id;

  try {
    const { data, error } = await supabase
      .from("complaints")
      .insert({
        user_id: userId,
        subject: complaint || "Support Request",
        message: complaint || "",
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    const notification = {
      userId,
      title: "Complaint Received",
      message: `Your complaint has been received by the support team and will be resolved soon.`,
      type: "notify",
    };
    await sendNotitfication(notification);

    return res.status(200).json({ failed: false, message: "Complaint Posted" });
  } catch (error) {
    next(error);
  }
};

export const getAllComplaint = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data: complaints, count, error } = await supabase
      .from("complaints")
      .select("*, users:user_id(firstname, lastname, username, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const complaints_ = (complaints || []).map((c) => ({
      id: c.id,
      _id: c.id,
      complaint: c.message,
      message: c.message,
      isResolved: c.status === "resolved",
      status: c.status,
      createdAt: c.created_at,
      ...(c.users || {}),
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: complaints_,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserComplaint = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const userId = req.user.id || req.user._id;

  try {
    const { data: complaints, count, error } = await supabase
      .from("complaints")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const complaints_ = (complaints || []).map((c) => ({
      id: c.id,
      _id: c.id,
      complaint: c.message,
      message: c.message,
      isResolved: c.status === "resolved",
      status: c.status,
      createdAt: c.created_at,
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: complaints_,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resolveComplaint = async (req, res, next) => {
  const { id } = req.query;

  try {
    const { data: complaint, error } = await supabase
      .from("complaints")
      .update({ status: "resolved" })
      .eq("id", id)
      .select()
      .single();

    if (error || !complaint) {
      const err = ErrorHandler(404, "Complaint not found");
      return res.status(404).json(err);
    }

    const notification = {
      userId: complaint.user_id,
      title: "Issue Resolved!",
      message: `Your complaint has been resolved by the support team.`,
      type: "notify",
    };
    await sendNotitfication(notification);

    return res.status(200).json({
      failed: false,
      message: "Complaint resolved",
    });
  } catch (error) {
    next(error);
  }
};
