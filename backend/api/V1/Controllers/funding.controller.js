import { userService, walletService, notificationService } from "../services/supabaseDb.service.js";
import { supabase } from "../config/supabase.config.js";
import { ErrorHandler } from "../utils/error.js";
import { sendNotitfication } from "../utils/notification.js";
import numeral from "numeral";

export const fundLocalWallet = async (req, res, next) => {
  try {
    const transData = req.body;
    const collection = transData.type === "COLLECTION";
    const walletReference = transData.walletReference;
    if (!collection) {
      return res.status(200).json({ failed: false, message: "Wallet funded" });
    }

    const existingFunding = await walletService.getFundingByReference(transData.paymentReference || transData.transactionReference);
    if (existingFunding) {
      return res.status(200).json({ failed: false, message: "Wallet funded" });
    }

    let user = null;
    if (req.user && (req.user.id || req.user._id)) {
      user = await userService.findById(req.user.id || req.user._id);
    }

    const amount = Number(transData.amountPaid || transData.amount || 0);
    const userId = user ? user.id : (transData.userId || null);

    if (userId) {
      await walletService.createFunding({
        userId,
        amount,
        reference: transData.paymentReference || transData.transactionReference || `fund_${Date.now()}`,
        paymentMethod: transData.paymentMethod || "online",
        status: "success",
      });

      await userService.incrementBalance(userId, amount);

      const notification = {
        userId,
        title: "Funding Successful",
        message: `Your funding of ₦${numeral(amount).format("0,0.00")} is successful. Check your balance for confirmation.`,
        type: "fund",
      };
      await sendNotitfication(notification);
    }

    return res.status(200).json({
      failed: false,
      message: "Wallet funded successfully.",
      data: {},
    });
  } catch (error) {
    console.error("fundLocalWallet error:", error);
    next(error);
  }
};

export const getFundings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const userId = req.user.id || req.user._id;

    const { data: fundings, count, error } = await supabase
      .from("funding")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const formattedFundings = (fundings || []).map((f) => ({
      id: f.id,
      _id: f.id,
      amount: f.amount,
      amountPaid: f.amount,
      reference: f.reference,
      paymentMethod: f.payment_method,
      status: f.status,
      createdAt: f.created_at,
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      data: formattedFundings,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFunding = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userId = req.user.id || req.user._id;
    const { data: funding, error } = await supabase
      .from("funding")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !funding) {
      const err = ErrorHandler(404, "Funding details not found");
      return res.status(404).json(err);
    }

    const formatted = {
      id: funding.id,
      _id: funding.id,
      amount: funding.amount,
      amountPaid: funding.amount,
      reference: funding.reference,
      paymentMethod: funding.payment_method,
      status: funding.status,
      createdAt: funding.created_at,
    };

    return res.status(200).json({
      failed: false,
      data: formatted,
      message: "Funding Details",
    });
  } catch (error) {
    next(error);
  }
};
