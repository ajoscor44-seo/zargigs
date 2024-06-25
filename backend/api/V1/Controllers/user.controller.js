import userDetails from "../../V1/Models/user-details.model.js";
import UserDetails from "../../V1/Models/user-details.model.js";
import AccessToken from "../Models/access-tokens.model.js";
import Admin from "../Models/admin.model.js";
import User from "../Models/user.model.js";
import useExternalApi from "../utils/client.js";
import { ErrorHandler } from "../utils/error.js";
import { sendNotitfication } from "../utils/notification.js";

export const getUserDetails = async (req, res, next) => {
  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  // Destructures user object
  const { _id, __v, iat, createdAt, updatedAt, role, ...rest } = req.user;

  const validUserDetails = await UserDetails.findOne({ userId: validUser._id });
  if (!validUserDetails) {
    return res.status(200).json({ ...rest });
  }

  // Destructures user details object
  const {
    userId,
    _id: detailsId,
    __v: detailsV,
    createdAt: detailsCreatedAt,
    updatedAt: detailsUpdatedAt,
    ...details
  } = validUserDetails._doc;

  res.json({ ...rest, ...details, id: _id });
  next();
};

export const addUserDetails = async (req, res, next) => {
  const {
    location,
    religion,
    gender,
    dateOfBirth,
    image,
    bankDetails,
    userEarnings,
  } = req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }
  let referrer = await User.findOne({ username: validUser.referredBy });
  //If NO referrer makes an admin referrer
  if (!referrer) referrer = await User.findOne({ role: "admin" });
  let referrerDetails = await UserDetails.findOne({ userId: referrer._id });
  if (!referrerDetails) {
    referrer = await User.findOne({ role: "admin" });
    referrerDetails = await UserDetails.findOne({ userId: referrer._id });
  }
  const adminDatas = await Admin.find();
  const adminData = adminDatas[0];

  // Checks for user details
  const userDetails = await UserDetails.findOne({ userId: validUser._id });
  if (userDetails) {
    const error = ErrorHandler(400, "User's details already exists.");
    return res.status(400).json(error);
  }

  try {
    const newUserDetails = new UserDetails({
      userId: validUser._id,
      location,
      religion,
      gender,
      dateOfBirth,
      bankDetails,
      userEarnings,
      walletDetails: {
        customerId: "",
        walletId: "",
        customerEmail: "",
        bankName: "",
        accountName: "",
        accountNumber: "",
        balance: 0,
        credit: 0,
        debit: 0,
        reference: "",
        virtualAccounts: {},
      },
    });
    if (image) {
      await User.findOneAndUpdate({ email: req.user.email }, { image });
    }
    referrerDetails.userEarnings = {
      ...referrerDetails.userEarnings,
      pendingEarnings:
        referrerDetails.userEarnings.pendingEarnings +
        0.6 * adminData.membershipFee,
    };
    await referrerDetails.save();
    await newUserDetails.save();

    res.status(200).json({
      failed: false,
      message: "User details added successfully",
      status: 200,
    });
    next();
  } catch (error) {
    next(error);
  }
};

// Updates user details
export const updateUserDetails = async (req, res, next) => {
  const { location, religion, dateOfBirth, image, bankDetails, userEarnings } =
    req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  // Checks for user details
  const userDetails = await UserDetails.findOne({ userId: req.user._id });
  if (!userDetails) {
    const error = ErrorHandler(400, "User's details does not exists.");
    return res.status(400).json(error);
  }

  // Code to update user details
  res.status(200).json("newUserDetails");
  next();
};

// Updates user details
export const becomeAMember = async (req, res, next) => {
  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    let referrer = await User.findOne({ username: validUser.referredBy });
    //If NO referrer makes an admin referrer
    if (!referrer) referrer = await User.findOne({ role: "admin" });
    let referrerDetails = await UserDetails.findOne({ userId: referrer._id });
    if (!referrerDetails) {
      referrer = await User.findOne({ role: "admin" });
      referrerDetails = await UserDetails.findOne({ userId: referrer._id });
    }
    // Gets admin data
    const adminDatas = await Admin.find();
    const adminData = adminDatas[0];

    // Gets base url and private key
    const baseUrl =
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_MONICREDIT_API
        : process.env.LIVE_MONICREDIT_API;
    const priKey =
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_PRI_KEY
        : process.env.PROD_PRI_KEY;

    // Creates transaction data
    const transactionData = {
      transaction_id: req.body.transactionId,
      private_key: priKey,
    };

    // Verifies payment
    const verificationData = await useExternalApi(
      `${baseUrl}/payment/transactions/verify-payment`,
      "POST",
      transactionData,
      null
    );
    if (!verificationData.status) {
      return res.status(402).json({
        message: `Payment verification failed: ${verificationData.message}`,
        failed: true,
      });
    }
    const verificationDetails = verificationData.data;
    if (verificationDetails.amount < adminData.membershipFee) {
      return res
        .status(402)
        .json({ message: "Insufficient balance", failed: true });
    }

    const mcToken = await AccessToken.findOne({ username: req.user.username });

    // Gets User Wallet Details From Initiated Transaction
    const accData = await useExternalApi(
      `${baseUrl}/payment/transactions/init-transaction-info/${req.body.transactionId}`,
      "GET",
      null,
      { token: mcToken.accessToken }
    );
    if (!accData.status) {
      return res
        .status(400)
        .json({ message: `Creation failed: ${accData.message}` });
    }
    const accDetails = accData.data.customer;

    // Creates Local User Wallet
    const walletDetails = {
      customerId: accDetails.customer_id,
      walletId: accDetails.wallet_id,
      customerEmail: accDetails.customer_email,
      bankName: accDetails.bank_name,
      accountName: accDetails.account_name,
      accountNumber: accDetails.account_number,
      balance: accDetails.balance,
      credit: accDetails.credit || 0,
      debit: accDetails.debit || 0,
      reference: accDetails.reference || "",
      virtualAccounts: accDetails.virtual_accounts || {},
    };
    // Updates User wallet details
    await userDetails.findOneAndUpdate(
      { userId: req.user._id },
      {
        walletDetails: walletDetails,
      }
    );

    // Updates referrer earning details
    referrerDetails.userEarnings = {
      ...referrerDetails.userEarnings,
      pendingEarnings:
        referrerDetails.userEarnings.pendingEarnings -
        0.6 * adminData.membershipFee,
      totalEarnings:
        referrerDetails.userEarnings.totalEarnings +
        0.6 * adminData.membershipFee,
      balance:
        referrerDetails.userEarnings.totalEarnings +
        0.6 * adminData.membershipFee,
    };
    referrerDetails.walletDetails = {
      ...referrerDetails.walletDetails,
      balance:
        referrerDetails.walletDetails.balance + 0.6 * adminData.membershipFee,
    };

    // Makes user a member
    await User.findByIdAndUpdate(req.user._id, { isMember: true });

    // Saves referrer details
    await referrerDetails.save();

    // Creates notitfication
    const notification = {
      userId: req.user._id,
      title: "Registration Completed!",
      message: `Congratulations ${req.user.firstname}, you are now a member of gigsflix, you are now eligible to enjoy all earning features available on this platform.`,
      type: "verification",
    };

    // Send notification to user
    await sendNotitfication(notification);

    // Returns response
    return res.status(200).send(1);
  } catch (error) {
    next(error);
  }
};
