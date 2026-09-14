import { supabase } from "../config/supabase.config.js";
import { ErrorHandler } from "../utils/error.js";

export const postAnnouncement = async (req, res, next) => {
  const { announcement, title = "Announcement" } = req.body;

  try {
    const { data, error } = await supabase
      .from("announcements")
      .insert({ title, content: announcement || req.body.content || "", is_active: true })
      .select()
      .single();

    if (error) throw error;
    return res
      .status(200)
      .json({ failed: false, message: "Announcement Posted" });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncement = async (req, res, next) => {
  try {
    const { data: announcements, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const announcements_ = (announcements || []).map((a) => ({
      id: a.id,
      _id: a.id,
      announcement: a.content,
      content: a.content,
      title: a.title,
      createdAt: a.created_at,
    }));

    return res.status(200).json({
      failed: false,
      data: announcements_,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.query;
    await supabase.from("announcements").delete().eq("id", id);
    return res.status(200).json({ failed: false, message: "Deleted" });
  } catch (error) {
    next(error);
  }
};
