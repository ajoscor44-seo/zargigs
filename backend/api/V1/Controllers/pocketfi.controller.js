import pocketfiService from "../services/pocketfi.service.js";
import { userService, walletService, userDetailsService, virtualAccountService } from "../services/supabaseDb.service.js";
import { sendNotitfication } from "../utils/notification.js";
import numeral from "numeral";

/**
 * GET /api/v1/wallet/banks
 * Fetch Nigerian Bank List with codes
 */
export const getBankList = async (req, res, next) => {
  try {
    const banks = await pocketfiService.getBankList();
    return res.status(200).json({
      failed: false,
      status: "success",
      banks,
      data: banks,
    });
  } catch (error) {
    console.error("getBankList controller error:", error);
    next(error);
  }
};

/**
 * POST /api/v1/wallet/verify-bank-account
 * Name Enquiry / Account Verification
 */
export const verifyBankAccount = async (req, res, next) => {
  try {
    const { accountNumber, bankCode, bankName } = req.body;

    if (!accountNumber || String(accountNumber).trim().length !== 10) {
      return res.status(400).json({
        failed: true,
        status: "error",
        message: "Please enter a valid 10-digit Nigerian account number.",
      });
    }

    const bankIdentifier = bankCode || bankName;
    if (!bankIdentifier) {
      return res.status(400).json({
        failed: true,
        status: "error",
        message: "Bank code or bank name is required.",
      });
    }

    const result = await pocketfiService.verifyBankAccount(
      String(accountNumber).trim(),
      bankIdentifier
    );

    if (result.verified) {
      return res.status(200).json({
        failed: false,
        status: "success",
        accountName: result.accountName,
        accountNumber: result.accountNumber,
        bankCode: result.bankCode,
      });
    } else {
      return res.status(400).json({
        failed: true,
        status: "error",
        message: result.message || "Could not verify bank account name.",
      });
    }
  } catch (error) {
    console.error("verifyBankAccount controller error:", error);
    next(error);
  }
};

/**
 * GET /api/v1/wallet/virtual-account
 * Get or Generate Dedicated Virtual Account for current user
 */
export const getVirtualAccount = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || req.query?.userId || req.headers?.["x-user-id"];
    
    if (!userId) {
      return res.status(200).json({
        failed: false,
        status: "success",
        walletDetails: null,
      });
    }

    let user = null;
    try {
      user = await userService.findById(userId);
      if (!user && req.user?.email) {
        user = await userService.findByEmail(req.user.email);
      }
    } catch {
      // ignore
    }

    // 1. Check Supabase dedicated virtual_accounts table first
    try {
      const dbAccount = await virtualAccountService.getByUserId(userId);
      if (dbAccount && dbAccount.account_number) {
        const va = {
          bankName: dbAccount.bank_name || "PAGA",
          accountNumber: dbAccount.account_number,
          accountName: dbAccount.account_name,
        };
        pocketfiService.saveStoredVirtualAccount(userId, va);
        return res.status(200).json({
          failed: false,
          status: "success",
          walletDetails: va,
        });
      }
    } catch (dbErr) {
      console.warn("virtualAccountService get notice:", dbErr.message);
    }

    // 2. Check Supabase user_details for virtual_account_number
    try {
      const details = await userDetailsService.getByUserId(userId);
      if (details?.virtual_account_number || details?.virtualAccountNumber) {
        const va = {
          bankName: details.virtual_account_bank || details.virtualAccountBank || "PAGA",
          accountNumber: details.virtual_account_number || details.virtualAccountNumber,
          accountName: details.virtual_account_name || details.virtualAccountName || user?.firstname || "Zargigs Earner",
        };
        pocketfiService.saveStoredVirtualAccount(userId, va);
        if (user?.id) virtualAccountService.saveVirtualAccount(user.id, va).catch(() => {});
        return res.status(200).json({
          failed: false,
          status: "success",
          walletDetails: va,
        });
      }
    } catch {
      // Continue
    }

    // 3. Check JSON cache
    const storedAccounts = pocketfiService.getStoredVirtualAccounts();
    const stored =
      storedAccounts[userId] ||
      (user?.id ? storedAccounts[user.id] : null) ||
      (user?.email ? storedAccounts[user.email] : null);

    if (stored && stored.accountNumber) {
      if (user?.id) {
        virtualAccountService.saveVirtualAccount(user.id, stored).catch(() => {});
      }
      return res.status(200).json({
        failed: false,
        status: "success",
        walletDetails: {
          bankName: stored.bankName,
          accountNumber: stored.accountNumber,
          accountName: stored.accountName,
        },
      });
    }

    // If not generated yet, return null so frontend shows "Generate" button
    return res.status(200).json({
      failed: false,
      status: "success",
      walletDetails: null,
    });
  } catch (error) {
    console.error("getVirtualAccount controller error:", error);
    next(error);
  }
};

/**
 * POST /api/v1/wallet/generate-virtual-account
 * Generate a new dedicated PocketFi virtual account on demand
 */
export const generateVirtualAccount = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || req.body?.userId || req.headers?.["x-user-id"];
    
    if (!userId) {
      return res.status(400).json({
        failed: true,
        message: "User identifier is required to generate virtual account.",
      });
    }

    let user = null;
    try {
      user = await userService.findById(userId);
      if (!user && req.user?.email) {
        user = await userService.findByEmail(req.user.email);
      }
    } catch {
      // fallback
    }

    if (!user) {
      user = {
        id: userId,
        _id: userId,
        firstname: req.body?.firstname || req.user?.user_metadata?.firstname || "User",
        lastname: req.body?.lastname || req.user?.user_metadata?.lastname || "",
        email: req.user?.email || req.body?.email || `user_${userId}@zargigs.com`,
        phone: req.body?.phone || req.user?.user_metadata?.phone || "08012345678",
      };
    }

    const forceNew = req.body?.forceNew !== undefined ? req.body.forceNew : true;
    const result = await pocketfiService.getOrCreateVirtualAccount(user, forceNew);

    if (result.status && result.accountNumber) {
      const accountData = {
        bankName: result.bankName,
        accountNumber: result.accountNumber,
        accountName: result.accountName,
      };

      const resolvedUserId = user.id || userId;

      // 1. Save to Supabase virtual_accounts table
      try {
        await virtualAccountService.saveVirtualAccount(resolvedUserId, accountData);
      } catch (dbErr) {
        console.warn("virtualAccountService save notice:", dbErr.message);
      }

      // 2. Save to Supabase user_details
      try {
        await userDetailsService.upsertUserDetails(resolvedUserId, {
          virtual_account_number: result.accountNumber,
          virtual_account_bank: result.bankName,
          virtual_account_name: result.accountName,
        });
      } catch (dbErr) {
        console.warn("userDetailsService upsert notice:", dbErr.message);
      }

      // 3. Save to memory/JSON cache for all user identifiers
      pocketfiService.saveStoredVirtualAccount(userId, accountData);
      if (user.id && user.id !== userId) pocketfiService.saveStoredVirtualAccount(user.id, accountData);
      if (user.email) pocketfiService.saveStoredVirtualAccount(user.email, accountData);

      return res.status(200).json({
        failed: false,
        status: "success",
        message: "Your dedicated PocketFi virtual account has been generated!",
        walletDetails: accountData,
      });
    } else {
      return res.status(400).json({
        failed: true,
        message: result.message || "Failed to generate dedicated virtual account with PocketFi.",
      });
    }
  } catch (error) {
    console.error("generateVirtualAccount error:", error);
    next(error);
  }
};

/**
 * POST /api/v1/webhook/pocketfi
 * Public Webhook Endpoint for PocketFi Deposit / Payment events
 */
export const handlePocketfiWebhook = async (req, res, next) => {
  try {
    const signature =
      req.headers["http_pocketfi_signature"] ||
      req.headers["x-pocketfi-signature"] ||
      req.headers["pocketfi-signature"] ||
      req.headers["signature"];

    const rawPayload = req.rawBody
      ? req.rawBody.toString("utf8")
      : JSON.stringify(req.body);

    console.log("--- POCKETFI WEBHOOK RECEIVED ---");
    console.log("Signature header:", signature);
    console.log("Webhook body:", req.body);

    // Validate Signature if provided
    if (signature && process.env.NODE_ENV === "production") {
      const isValidSignature = pocketfiService.verifyWebhookSignature(
        rawPayload,
        signature
      );
      if (!isValidSignature) {
        console.warn("PocketFi Webhook: Invalid Signature rejected");
        return res.status(400).json({ status: "error", message: "Invalid signature" });
      }
    }

    const body = req.body || {};
    const payload = body.data || body.payload || body;
    const transaction = payload.transaction || body.transaction || {};
    const order = payload.order || body.order || {};
    const customer = payload.customer || payload.user || body.customer || {};

    const reference =
      transaction.reference ||
      payload.reference ||
      payload.payment_reference ||
      body.reference ||
      payload.id ||
      `pfi_${Date.now()}`;

    const amount = Number(
      order.amount ||
        payload.amount ||
        payload.amount_paid ||
        order.settlement_amount ||
        transaction.amount ||
        body.amount ||
        0
    );

    const accountNumber =
      payload.account_number ||
      payload.virtual_account ||
      payload.account ||
      transaction.account_number ||
      body.account_number ||
      payload.accountNumber;

    // Check if this reference was already credited to prevent duplicate processing
    const existingFunding = await walletService.getFundingByReference(reference);
    if (existingFunding) {
      console.log(`PocketFi Webhook: Transaction ${reference} already processed.`);
      return res.status(200).json({ status: "success", message: "Transaction already processed" });
    }

    // Identify the user
    let user = null;

    // 1. Match by virtual account database table or mapping
    if (accountNumber) {
      const dbMapping = await virtualAccountService.getByAccountNumber(accountNumber);
      if (dbMapping && dbMapping.user_id) {
        user = await userService.findById(dbMapping.user_id);
      }
      if (!user) {
        const storedMapping =
          pocketfiService.getStoredVirtualAccountByNumber(accountNumber);
        if (storedMapping && storedMapping.userId) {
          user = await userService.findById(storedMapping.userId);
        }
      }
    }

    // 2. Match by email or customer details
    if (!user && (customer.email || payload.email || body.email)) {
      user = await userService.findByEmail(customer.email || payload.email || body.email);
    }

    // 3. Match by user_id in payload/order metadata
    if (!user && (payload.user_id || payload.userId || order.user_id || body.user_id)) {
      user = await userService.findById(
        payload.user_id || payload.userId || order.user_id || body.user_id
      );
    }

    if (user && amount > 0) {
      // 1. Increment user wallet balance
      await userService.incrementBalance(user.id, amount);

      // 2. Record funding transaction
      await walletService.createFunding({
        userId: user.id,
        amount,
        reference,
        paymentMethod: "pocketfi_virtual_account",
        status: "success",
      });

      // 3. Send in-app push notification
      const notification = {
        userId: user.id,
        title: "Deposit Successful! 🎉",
        message: `Your deposit of ₦${numeral(amount).format(
          "0,0.00"
        )} via dedicated bank transfer was successful. Your balance has been updated.`,
        type: "fund",
      };
      await sendNotitfication(notification);

      console.log(
        `PocketFi Webhook: Successfully credited user ${user.username} (${user.id}) with ₦${amount}. Ref: ${reference}`
      );
    } else {
      console.warn(
        `PocketFi Webhook: Could not match user or invalid amount: ${amount}, user: ${user?.id}`
      );
    }

    return res.status(200).json({
      status: "success",
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("handlePocketfiWebhook error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

