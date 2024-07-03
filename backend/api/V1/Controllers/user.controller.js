import UserDetails from "../../V1/Models/user-details.model.js";
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

  const referrals = await Promise.all(
    validUser.referrals.map(async (referral) => {
      const user = await User.findById(referral.userId);

      const {
        username,
        email,
        isEmailVerified,
        isMember,
        isBanned,
        image,
        ...rest
      } = user.toObject();

      return { username, email, isEmailVerified, isMember, isBanned, image };
    })
  );

  // Destructures user details object
  const {
    userId,
    _id: detailsId,
    __v: detailsV,
    createdAt: detailsCreatedAt,
    updatedAt: detailsUpdatedAt,
    ...details
  } = validUserDetails._doc;
  const uDetails = { ...details, referrals };

  res.json({ ...rest, ...uDetails, id: _id });
  next();
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

    // Gets base url and private key
    const baseUrl =
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_MONICREDIT_API
        : process.env.LIVE_MONICREDIT_API;
    const priKey =
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_PRI_KEY
        : process.env.PROD_PRI_KEY;

    // Creates user data
    const userData = {
      private_key: priKey,
      first_name: req.user.firstname,
      last_name: req.user.lastname,
      phone: "0" + req.user.phone,
      email: req.user.email,
    };

    // Creates Virtual Account For User
    const accData = await useExternalApi(
      `${baseUrl}/payment/virtual-account/create`,
      "POST",
      userData,
      null
    );
    if (!accData.status) {
      return res
        .status(400)
        .json({ message: `Creation failed: ${accData.message}` });
    }
    const accDetails = accData.data;

    // Creates user details for user
    const newUserDetails = new UserDetails({
      userId: validUser._id,
      location,
      religion,
      gender,
      dateOfBirth,
      bankDetails,
      userEarnings,
      walletDetails: {
        customerId: accDetails.customer_id,
        walletId: accDetails.wallet_id,
        customerEmail: accDetails.customer_email,
        bankName: accDetails.bank_name,
        accountName: accDetails.account_name,
        accountNumber: accDetails.account_number,
        balance: accDetails.balance,
        credit: accDetails.credit,
        debit: accDetails.debit,
        reference: accDetails.reference,
        virtualAccounts: accDetails.virtual_accounts,
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
    let userDetails = await UserDetails.findOne({ userId: req.user._id });
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

    // Verifies payment
    const balanceIsNotValid =
      userDetails.userEarnings.balance < adminData.membershipFee;
    if (balanceIsNotValid) {
      return res.status(406).json({
        failed: true,
        message: "Insufficient balance. Fund your wallet to continue.",
      });
    }

    // Updates referrer earning details
    referrerDetails.userEarnings = {
      ...referrerDetails.userEarnings,
      pendingEarnings:
        Number(referrerDetails.userEarnings.pendingEarnings) -
        0.6 * Number(adminData.membershipFee),
      totalEarnings:
        Number(referrerDetails.userEarnings.totalEarnings) +
        0.6 * Number(adminData.membershipFee),
      balance:
        Number(referrerDetails.userEarnings.balance) +
        0.6 * Number(adminData.membershipFee),
    };
    referrerDetails.walletDetails = {
      ...referrerDetails.walletDetails,
      balance:
        Number(referrerDetails.walletDetails.balance) +
        0.6 * Number(adminData.membershipFee),
    };

    // Updates user balance
    userDetails.userEarnings = {
      ...userDetails.userEarnings,
      balance:
        Number(userDetails.userEarnings.balance) -
        Number(adminData.membershipFee),
    };
    userDetails.walletDetails = {
      ...userDetails.walletDetails,
      balance:
        Number(userDetails.walletDetails.balance) -
        Number(adminData.membershipFee),
    };

    // Makes user a member
    await User.findByIdAndUpdate(req.user._id, { isMember: true });

    // Saves user and referrer wallet details
    await referrerDetails.save();
    await userDetails.save();

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
    return res
      .status(200)
      .json({ failed: false, message: "You are now a member" });
  } catch (error) {
    next(error);
  }
};
