import Announcement from "../Models/announcement.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const postAnnouncement = async (req, res, next) => {
  const { announcement } = req.body;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const newAnnouncement = new Announcement({
      createdBy: req.user._id,
      announcement,
    });

    await newAnnouncement.save();
    return res
      .status(200)
      .json({ failed: false, message: "Announcemnet Posted" });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncement = async (req, res, next) => {
  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const announcements = await Announcement.find();

    const announcements_ = announcements.map((announcement) => {
      const { updatedAt, createdBy, createdAt, __v, _id, ...rest } =
        announcement?.toObject();

      return {
        id: _id,
        ...rest,
      };
    });

    return res.status(200).json({
      failed: false,
      data: announcements_,
    });
  } catch (error) {
    next(error);
  }
};
