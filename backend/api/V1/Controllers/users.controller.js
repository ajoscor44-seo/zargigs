import { userService, userDetailsService } from "../services/supabaseDb.service.js";
import { supabase } from "../config/supabase.config.js";

export const getAllUsers = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data: users, count, error } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Fetch user_details for bank details
    const userIds = (users || []).map((u) => u.id);
    let detailsMap = new Map();
    if (userIds.length > 0) {
      const { data: details } = await supabase
        .from("user_details")
        .select("*")
        .in("user_id", userIds);

      (details || []).forEach((d) => {
        detailsMap.set(d.user_id, d);
      });
    }

    const users_ = (users || []).map((user) => {
      const { password, ...rest } = user;
      const detail = detailsMap.get(user.id) || {};
      return {
        id: user.id,
        _id: user.id,
        ...rest,
        bankName: detail.bank_name || "",
        accountNumber: detail.account_number || "",
        accountName: detail.account_name || "",
        bank_name: detail.bank_name || "",
        account_number: detail.account_number || "",
        account_name: detail.account_name || "",
        bankDetails: {
          bankName: detail.bank_name || "",
          accountNumber: detail.account_number || "",
          accountName: detail.account_name || "",
        },
        virtual_account_bank: detail.virtual_account_bank || "",
        virtual_account_number: detail.virtual_account_number || "",
        virtual_account_name: detail.virtual_account_name || "",
        gender: detail.gender || "",
        state: detail.state || "",
        lga: detail.lga || "",
        bvn: detail.bvn || "",
        nin: detail.nin || "",
      };
    });

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: users_,
      users: users_,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersTotals = async (req, res, next) => {
  try {
    const { data: allUsers, error: err } = await supabase
      .from("users")
      .select("id, is_member, is_banned, balance");

    if (err) throw err;

    const totalCount = allUsers?.length || 0;
    const totalMembers = allUsers?.filter((u) => u.is_member).length || 0;
    const totalBanned = allUsers?.filter((u) => u.is_banned).length || 0;
    const totalBalance = (allUsers || []).reduce((acc, u) => acc + (Number(u.balance) || 0), 0);

    return res.status(200).json({
      failed: false,
      totalUsers: totalCount,
      totalMembers: totalMembers,
      totalBanned: totalBanned,
      totalBalance: totalBalance,
      meta: {
        total: totalCount,
        members: totalMembers,
        banned: totalBanned,
        balance: totalBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAUser = async (req, res, next) => {
  const { id } = req.query;

  try {
    const user = await userService.findById(id);
    if (!user) {
      return res.status(404).json({ failed: true, message: "User not found" });
    }
    const { password, ...rest } = user;

    const userDetails = await userDetailsService.getByUserId(id);
    const detailsRest = userDetails || {};

    return res.status(200).json({
      failed: false,
      data: { id: user.id, _id: user.id, ...rest, ...detailsRest },
    });
  } catch (error) {
    next(error);
  }
};
