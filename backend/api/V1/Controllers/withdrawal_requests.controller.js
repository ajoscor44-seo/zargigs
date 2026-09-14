import { userService, userDetailsService, walletService, notificationService } from "../services/supabaseDb.service.js";
import { supabase } from "../config/supabase.config.js";
import bcryptjs from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";
import { sendNotitfication } from "../utils/notification.js";
import numeral from "numeral";

export const getAllWithdrawalRequests = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data: requests, count, error } = await supabase
      .from("withdrawal_requests")
      .select("*, users:user_id(firstname, lastname, username, email, phone)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const allWithdrawalRequests_ = (requests || []).map((wr) => ({
      id: wr.id,
      _id: wr.id,
      userId: wr.user_id,
      amount: wr.amount,
      withdrawalAmount: wr.amount,
      charges: 0,
      status: wr.status,
      bankName: wr.bank_name,
      accountNumber: wr.account_number,
      accountName: wr.account_name,
      bankDetails: {
        bankName: wr.bank_name,
        accountNumber: wr.account_number,
        accountName: wr.account_name,
      },
      date: wr.created_at,
      createdAt: wr.created_at,
      ...(wr.users || {}),
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.json({
      failed: false,
      data: allWithdrawalRequests_,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserWithdrawalRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const userId = req.user.id || req.user._id;

    const { data: requests, count, error } = await supabase
      .from("withdrawal_requests")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const userWithdrawalRequests_ = (requests || []).map((wr) => ({
      id: wr.id,
      _id: wr.id,
      charges: 0,
      amount: wr.amount,
      withdrawalAmount: wr.amount,
      status: wr.status,
      bankDetails: {
        bankName: wr.bank_name,
        accountNumber: wr.account_number,
        accountName: wr.account_name,
      },
      date: wr.created_at,
      createdAt: wr.created_at,
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: userWithdrawalRequests_,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const postWithdrawalRequests = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { withdrawalAmount: amount, charges = 0, password } = req.body;
    const withdrawalAmount = Math.abs(Number(amount));

    if (withdrawalAmount < 100) {
      const error = ErrorHandler(400, "You cannot withdraw less than ₦100");
      return res.status(400).json(error);
    }

    const validUser = await userService.findById(userId);
    if (!validUser) {
      const error = ErrorHandler(404, "User not found.");
      return res.status(404).json(error);
    }

    const userDetails = await userDetailsService.getByUserId(userId);
    const validPassword = password && bcryptjs.compareSync(password, validUser.password || "");
    if (!validPassword) {
      const error = ErrorHandler(401, "Wrong credentials");
      return res.status(401).json(error);
    }

    const totalDeduction = withdrawalAmount + Number(charges);
    if ((Number(validUser.balance) || 0) < totalDeduction) {
      const error = ErrorHandler(406, "Insufficient balance");
      return res.status(406).json(error);
    }

    // Deduct balance
    await userService.decrementBalance(userId, totalDeduction);

    // Create withdrawal request
    await walletService.createWithdrawal(userId, withdrawalAmount, {
      bankName: userDetails?.bank_name || userDetails?.bankName || "",
      accountNumber: userDetails?.account_number || userDetails?.accountNumber || "",
      accountName: userDetails?.account_name || userDetails?.accountName || "",
    });

    const notification = {
      userId: userId,
      title: "Withdrawal Requested!",
      message: `Your withdrawal request of ₦${numeral(withdrawalAmount).format(
        "0,0.00"
      )} has been received and will be reviewed by support.`,
      type: "withdraw",
    };
    await sendNotitfication(notification);

    return res.status(200).json({
      failed: false,
      message: "Withdrawal Requested. Please wait for approval.",
    });
  } catch (error) {
    next(error);
  }
};

export const approveWithdrawalRequests = async (req, res, next) => {
  try {
    const { id, userId, amount } = req.body;

    await supabase
      .from("withdrawal_requests")
      .update({ status: "approved" })
      .eq("id", id);

    const notification = {
      userId: userId,
      title: "Withdrawal Approved",
      message: `Congratulations, your withdrawal of ₦${numeral(amount).format(
        "0,0.00"
      )} has been approved. Kindly check your withdrawal history and bank account.`,
      type: "withdraw",
    };
    await sendNotitfication(notification);

    return res
      .status(200)
      .json({ failed: false, message: "Withdrawal approved successfully" });
  } catch (error) {
    next(error);
  }
};

export const disapproveWithdrawalRequests = async (req, res, next) => {
  try {
    const { amount, userId, id, reason = "", returnAmount } = req.body;

    if (returnAmount) {
      await userService.incrementBalance(userId, Number(amount));
    }

    await supabase
      .from("withdrawal_requests")
      .update({ status: "disapproved" })
      .eq("id", id);

    const notification = {
      userId: userId,
      title: "Withdrawal Disapproved",
      message: `Oops, your withdrawal of ₦${numeral(amount).format(
        "0,0.00"
      )} has been disapproved ${reason}.`,
      type: "withdraw",
    };
    await sendNotitfication(notification);

    return res
      .status(200)
      .json({ failed: false, message: "Withdrawal disapproved successfully" });
  } catch (error) {
    next(error);
  }
};
