import useExternalApi from "../../../../frontend/app/src/hooks/useExternalRequest.js";
import userDetails from "../../V1/Models/user-details.model.js";
import UserDetails from "../../V1/Models/user-details.model.js";
import Admin from "../Models/admin.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import logger from "../utils/logger.util.js";
import axios from "axios";

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
    });
    if (image) {
      await User.findOneAndUpdate({ email: req.user.email }, { image });
    }
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
  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  const baseUrl =
    process.env.NODE_ENV !== "production"
      ? process.env.DEMO_MONICREDIT_API
      : process.env.LIVE_MONICREDIT_API;
  const priKey =
    process.env.NODE_ENV !== "production"
      ? process.env.DEMO_PRI_KEY
      : process.env.PROD_PRI_KEY;

  const transactionData = {
    transaction_id: req.body.transactionId,
    private_key: priKey,
  };

  const checkVerificationStatus = async (data) => {
    if (!data.status) {
      return res
        .status(402)
        .json({ message: "Payment verification failed", failed: true });
    }
    const userData = {
      private_key: priKey,
      first_name: req.user.firstname,
      last_name: req.user.lastname,
      phone: req.user.phone || "09151604081",
      email: req.user.email,
    };

    const createLocalUserWallet = async () => {
      let walletDetails;

      if (data)
        walletDetails = {
          customerId: data.data.customer_id,
          walletId: data.data.wallet_id,
          customerEmail: data.data.customer_email,
          bankName: data.data.bank_name,
          accountName: data.data.account_name,
          accountNumber: data.data.account_number,
          balance: data.data.balance,
          credit: data.data.credit,
          debit: data.data.debit,
          reference: data.data.reference,
          virtualAccounts: data.data.virtual_accounts,
        };

      // Makes user a member
      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          isMember: true,
        }
      );

      // Updates User wallet details
      await userDetails.findOneAndUpdate(
        { userId: req.user._id },
        {
          walletDetails: walletDetails || data.data,
        }
      );

      // Response
      return res.status(200).json({
        message: "You are now a member",
        failed: false,
      });
    };

    // Creates Virtual Account For User
    useExternalApi(
      `${baseUrl}/payment/virtual-account/create`,
      createLocalUserWallet,
      "POST",
      userData
    );
  };

  // Makes request to an external api
  useExternalApi(
    `${baseUrl}/payment/transactions/verify-transaction`,
    checkVerificationStatus,
    "GET",
    transactionData
  );
};
