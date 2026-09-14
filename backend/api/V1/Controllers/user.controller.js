import { userService, userDetailsService, adminService, notificationService } from "../services/supabaseDb.service.js";
import { ErrorHandler } from "../utils/error.js";
import { sendNotitfication } from "../utils/notification.js";
import useExternalApi from "../utils/client.js";
import pocketfiService from "../services/pocketfi.service.js";

export const getUserDetails = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const validUser = await userService.findById(userId) || await userService.findByEmail(req.user.email);
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const { id, password, ...restUser } = validUser;
    const validUserDetails = await userDetailsService.getByUserId(validUser.id);

    let referrals = [];
    try {
      // 1. Collect user IDs/references from validUser.referrals JSON
      const refList = Array.isArray(validUser.referrals) ? validUser.referrals : [];
      const refUserIds = refList
        .map((r) => (typeof r === "string" ? r : r?.userId || r?.id || r?._id))
        .filter(Boolean);

      // 2. Also find users who registered using this user's referral code/username
      let dbReferred = [];
      if (validUser.username) {
        try {
          const { data: byRef } = await supabase
            .from("users")
            .select("id, username, firstname, lastname, email, avatar_url, image, is_member, is_email_verified, created_at")
            .or(`referred_by.eq.${validUser.username},referred_by.eq.${validUser.id}`);
          if (byRef && byRef.length) {
            dbReferred = byRef;
          }
        } catch (e) {
          // ignore error if supabase direct fails
        }
      }

      // 3. Resolve refUserIds
      const resolvedFromList = (
        await Promise.all(
          refUserIds.map(async (uId) => {
            try {
              return await userService.findById(uId);
            } catch {
              return null;
            }
          })
        )
      ).filter(Boolean);

      // 4. Combine and deduplicate
      const seen = new Set();
      const combined = [...resolvedFromList, ...dbReferred].filter((u) => {
        if (!u || !u.id || seen.has(u.id)) return false;
        if (u.id === validUser.id) return false; // exclude self
        seen.add(u.id);
        return true;
      });

      referrals = combined.map((u) => ({
        id: u.id,
        username: u.username || "",
        firstname: u.firstname || "",
        lastname: u.lastname || "",
        email: u.email || "",
        isMember: Boolean(u.is_member ?? u.isMember),
        isEmailVerified: Boolean(u.is_email_verified ?? u.isEmailVerified),
        image: u.avatar_url || u.avatarUrl || u.image || "",
        createdAt: u.created_at || u.createdAt || null,
      }));
    } catch (err) {
      console.warn("Referrals resolution fallback:", err);
      referrals = [];
    }

    const details = validUserDetails || {};

    // Get dedicated PocketFi virtual account if already generated
    const storedVA = pocketfiService.getStoredVirtualAccountByNumber
      ? pocketfiService.getStoredVirtualAccounts?.()[validUser.id] || null
      : null;

    const uDetails = {
      ...details,
      referrals,
      bankDetails: {
        bankName: details.bank_name || details.bankName || "",
        accountNumber: details.account_number || details.accountNumber || "",
        accountName: details.account_name || details.accountName || "",
      },
      userEarnings: {
        balance: validUser.balance || 0,
        pendingEarnings: validUser.pendingBalance || 0,
        totalEarnings: validUser.balance || 0,
      },
      walletDetails: {
        balance: validUser.balance || 0,
        bankName: storedVA?.bankName || "Paga / PocketFi",
        accountNumber: storedVA?.accountNumber || "",
        accountName: storedVA?.accountName || `${validUser.firstname} ${validUser.lastname}`,
      },
    };

    return res.json({
      ...restUser,
      ...uDetails,
      id: validUser.id,
      _id: validUser.id,
      image: validUser.avatarUrl || validUser.image,
    });
  } catch (error) {
    console.error("getUserDetails error:", error);
    next(error);
  }
};

export const addUserDetails = async (req, res, next) => {
  try {
    const {
      location,
      religion,
      gender,
      dateOfBirth,
      image,
      bankDetails,
      userEarnings,
    } = req.body;

    const userId = req.user.id || req.user._id;
    const validUser = await userService.findById(userId) || await userService.findByEmail(req.user.email);
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    let referrer = await userService.findByUsername(validUser.referredBy);
    if (!referrer) referrer = await userService.findAdmin();

    const adminData = await adminService.getAdminSettings();

    if (image) {
      await userService.updateUser(validUser.id, { avatarUrl: image, image });
    }

    await userDetailsService.upsertUserDetails(validUser.id, {
      gender,
      state: location?.state || location,
      lga: location?.lga || "",
      bankName: bankDetails?.bankName,
      accountNumber: bankDetails?.accountNumber,
      accountName: bankDetails?.accountName,
    });

    if (referrer) {
      const bonus = 0.6 * (Number(adminData.membershipFee) || 1000);
      await userService.updateUser(referrer.id, {
        pendingBalance: (Number(referrer.pendingBalance) || 0) + bonus,
      });
    }

    return res.status(200).json({
      failed: false,
      message: "User details added successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const generateUserWallet = async (req, res, next) => {
  try {
    const nin = req.query?.nin;
    const userId = req.user.id || req.user._id;
    const user = await userService.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await userService.updateUser(user.id, { isNINVerified: true });
    if (nin) {
      await userDetailsService.upsertUserDetails(user.id, { nin });
    }

    // Provision dedicated PocketFi virtual account
    const vaResult = await pocketfiService.getOrCreateVirtualAccount(user);

    return res.status(200).json({
      message: "Wallet created successfully",
      walletDetails: {
        bankName: vaResult.bankName,
        accountNumber: vaResult.accountNumber,
        accountName: vaResult.accountName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserDetails = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      phone,
      location,
      religion,
      dateOfBirth,
      image,
      bankDetails,
      gender,
    } = req.body;
    const userId = req.user.id || req.user._id;

    const userUpdates = {};
    if (image) userUpdates.avatarUrl = image;
    if (firstname) userUpdates.firstname = firstname;
    if (lastname) userUpdates.lastname = lastname;
    if (phone) userUpdates.phone = phone;

    if (Object.keys(userUpdates).length > 0) {
      await userService.updateUser(userId, userUpdates);
    }

    await userDetailsService.upsertUserDetails(userId, {
      gender: gender,
      state: location?.state || (typeof location === "string" ? location : undefined),
      lga: location?.lga || location?.LGA,
      religion: religion,
      dateOfBirth: dateOfBirth,
      bankName: bankDetails?.bankName,
      accountNumber: bankDetails?.accountNumber,
      accountName: bankDetails?.accountName,
    });

    return res.status(200).json({ message: "User details updated successfully", failed: false });
  } catch (error) {
    next(error);
  }
};

export const becomeAMember = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const validUser = await userService.findById(userId);
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const adminData = await adminService.getAdminSettings();
    const membershipFee = Number(adminData.membershipFee) || 1000;

    if ((Number(validUser.balance) || 0) < membershipFee) {
      return res.status(406).json({
        failed: true,
        message: "Insufficient balance. Fund your wallet to continue.",
      });
    }

    // Deduct user balance
    await userService.decrementBalance(validUser.id, membershipFee);
    await userService.updateUser(validUser.id, { isMember: true });

    // Referrer bonus
    let referrer = await userService.findByUsername(validUser.referredBy);
    if (referrer) {
      const bonus = 0.6 * membershipFee;
      await userService.incrementBalance(referrer.id, bonus);
    }

    // Notification
    const notification = {
      userId: validUser.id,
      title: "Registration Completed!",
      message: `Congratulations ${validUser.firstname}, you are now a member of Zargigs, you are now eligible to enjoy all earning features available on this platform.`,
      type: "verification",
    };
    await sendNotitfication(notification);

    return res.status(200).json({ failed: false, message: "You are now a member" });
  } catch (error) {
    next(error);
  }
};
