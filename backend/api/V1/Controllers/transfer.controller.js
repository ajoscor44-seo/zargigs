import { userService, walletService, notificationService } from "../services/supabaseDb.service.js";
import { supabase } from "../config/supabase.config.js";
import bcryptjs from "bcryptjs";
import numeral from "numeral";
import { ErrorHandler } from "../utils/error.js";
import { sendNotitfication } from "../utils/notification.js";

export const makeTransfer = async (req, res, next) => {
  try {
    const { receiver, amount: transferAmount, password, charges = 0 } = req.body;
    const amount = Math.abs(Number(transferAmount));

    if (receiver.toLowerCase() === req.user.username.toLowerCase()) {
      const error = ErrorHandler(400, "You cannot transfer to yourself");
      return res.status(400).json(error);
    }

    const receiverUser = await userService.findByUsername(receiver.toLowerCase());
    if (!receiverUser) {
      const error = ErrorHandler(404, "Username does not exist.");
      return res.status(404).json(error);
    }

    const senderId = req.user.id || req.user._id;
    const senderUser = await userService.findById(senderId);

    if (!senderUser) {
      const error = ErrorHandler(404, "Sender does not exist.");
      return res.status(404).json(error);
    }

    // Validates password
    const validPassword = password && bcryptjs.compareSync(password, senderUser.password || "");
    if (!validPassword) {
      const error = ErrorHandler(401, "Wrong Password");
      return res.status(401).json(error);
    }

    const totalDeduction = amount + Number(charges);
    if ((Number(senderUser.balance) || 0) < totalDeduction) {
      const error = ErrorHandler(406, "Insufficient balance");
      return res.status(406).json(error);
    }

    // Execute transfer
    await userService.decrementBalance(senderId, totalDeduction);
    await userService.incrementBalance(receiverUser.id, amount);
    await walletService.createTransfer(senderId, receiverUser.id, amount, `Transfer to ${receiverUser.username}`);

    // Send notifications
    const senderNotification = {
      userId: senderId,
      title: "Transfer Successful",
      message: `Your transfer of ₦${numeral(amount).format("0,0.00")} to ${receiverUser.username} is successful.`,
      type: "verification",
    };
    const receiverNotification = {
      userId: receiverUser.id,
      title: "Credit Alert!",
      message: `You just received ₦${numeral(amount).format("0,0.00")} from ${req.user.username}. Check your balance and transfer history for confirmation.`,
      type: "withdraw",
    };

    await sendNotitfication(receiverNotification);
    await sendNotitfication(senderNotification);

    return res.status(200).json({ failed: false, message: "Transfer successful" });
  } catch (error) {
    next(error);
  }
};

export const getUserTransfers = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { data: transfers, error } = await supabase
      .from("transfers")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formatted = (transfers || []).map((t) => ({
      id: t.id,
      _id: t.id,
      sender: t.sender_id,
      receiver: t.receiver_id,
      amountSent: t.amount,
      amount: t.amount,
      narration: t.narration,
      status: t.status,
      createdAt: t.created_at,
    }));

    return res.status(200).json({
      failed: false,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransfers = async (req, res, next) => {
  try {
    const { data: transfers, error } = await supabase
      .from("transfers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return res.status(200).json({ failed: false, data: transfers });
  } catch (error) {
    next(error);
  }
};
