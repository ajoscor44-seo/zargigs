import { advertService, userService } from "../services/supabaseDb.service.js";
import { supabase } from "../config/supabase.config.js";
import { processPayment } from "./tasks.controller.js";

export const getAdvertisements = async (req, res, next) => {
  try {
    const advertisements = await advertService.getActiveAdvertisements();
    return res.status(200).json({
      failed: false,
      data: advertisements,
    });
  } catch (error) {
    console.error("getAdvertisements error:", error);
    next(error);
  }
};

export const getUserAdvertisements = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || req.headers["x-user-id"] || req.query.userId || req.query.user_id;
    let query = supabase.from("advertisements").select("*").order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("posted_by", userId);
    }

    const { data: advertisements, error } = await query;

    if (error) throw error;

    return res.status(200).json({
      failed: false,
      data: (advertisements || []).map((ad) => ({ id: ad.id, _id: ad.id, ...ad })),
    });
  } catch (error) {
    console.error("getUserAdvertisements error:", error);
    next(error);
  }
};

export const getAllAdvertisements = async (req, res, next) => {
  try {
    const { data: advertisements, error } = await supabase
      .from("advertisements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      failed: false,
      data: (advertisements || []).map((ad) => ({ id: ad.id, _id: ad.id, ...ad })),
    });
  } catch (error) {
    console.error("getAllAdvertisements error:", error);
    next(error);
  }
};

export const createAdvertisement = async (req, res, next) => {
  try {
    const { name, link, banner, description, duration } = req.body;
    const userId = req.user.id || req.user._id;

    const paymentResponse = await processPayment(
      Number(duration) * 1500,
      "zargigs advert",
      userId
    );

    if (paymentResponse.failed) {
      return res.status(400).json(paymentResponse);
    }

    await advertService.createAdvertisement({
      name,
      link,
      banner,
      description,
      duration: Number(duration),
      postedBy: userId,
    });

    return res
      .status(201)
      .json({ failed: false, message: "Advert created successfully" });
  } catch (error) {
    console.error("createAdvertisement error:", error);
    next(error);
  }
};

export const deleteAdvertisement = async (req, res, next) => {
  try {
    const id = req.params.id;
    await supabase.from("advertisements").delete().eq("id", id);
    return res.status(200).json({ failed: false, message: "Advertisement deleted successfully" });
  } catch (error) {
    console.error("deleteAdvertisement error:", error);
    next(error);
  }
};
