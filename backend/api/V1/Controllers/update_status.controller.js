import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const updateUserStatus = async (req, res, next) => {
  const { status, id } = req.query;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { isBanned: status }
    );

    if (!updatedUser) {
      const error = ErrorHandler(404, "User not found");
      return res.status(404).json(error);
    }

    return res.status(200).json({
      failed: false,
      message: "User status updated",
    });
  } catch (error) {
    next(error);
  }
};
