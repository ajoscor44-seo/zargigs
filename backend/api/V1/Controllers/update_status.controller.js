import { userService } from "../services/supabaseDb.service.js";
import { ErrorHandler } from "../utils/error.js";

export const updateUserStatus = async (req, res, next) => {
  const { status, id, role, isMember, balanceAdjustment } = { ...req.query, ...req.body };

  try {
    if (!id) {
      return res.status(400).json({ failed: true, message: "User ID is required" });
    }

    const updates = {};
    if (status !== undefined) {
      updates.isBanned = status === "true" || status === true;
    }
    if (role !== undefined) {
      updates.role = role;
    }
    if (isMember !== undefined) {
      updates.isMember = isMember === "true" || isMember === true;
    }

    if (balanceAdjustment !== undefined && Number(balanceAdjustment) !== 0) {
      const user = await userService.findById(id);
      if (user) {
        const newBal = (Number(user.balance) || 0) + Number(balanceAdjustment);
        updates.balance = Math.max(0, newBal);
      }
    }

    const updatedUser = await userService.updateUser(id, updates);

    if (!updatedUser) {
      const error = ErrorHandler(404, "User not found");
      return res.status(404).json(error);
    }

    return res.status(200).json({
      failed: false,
      message: "User status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateUserStatus error:", error);
    next(error);
  }
};
