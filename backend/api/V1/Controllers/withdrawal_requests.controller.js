import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";
import WithdrawalRequests from "../Models/withdrawal_requests.model.js";
import userDetails from "../Models/user-details.model.js";
import { sendNotitfication } from "../utils/notification.js";
import numeral from "numeral";

export const getAllWithdrawalRequests = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const allWithdrawalRequests = await WithdrawalRequests.find()
      .sort({ createdAt: -1})
      .skip((page - 1) * limit)
      .limit(limit);

    const allWithdrawalRequests_ = await Promise.all(
      allWithdrawalRequests.map(async (withdrawalRequest) => {
        const { updatedAt, userId, createdAt, __v, _id, ...rest } =
          withdrawalRequest?.toObject();
        const user_details = await userDetails.findOne({
          userId,
        });
        const {
          __v: detailsV,
          _id: detailsUId,
          location,
          gender,
          userId: detailsId,
          updatedAt: detailsUA,
          createdAt: detailsCA,
          dateOfBirth,
          bankDetails,
          religion,
          ...details_rest
        } = user_details._doc;
        const user = await User.findById(userId);
        const {
          __v: userV,
          _id: userUId,
          updatedAt: userUA,
          createdAt: userCA,
          role,
          referrals,
          isMember,
          isBanned,
          isEmailVerified,
          password,
          ...user_rest
        } = user._doc;

        return {
          id: _id,
          userId,
          ...rest,
          ...details_rest,
          ...user_rest,
        };
      })
    );

    const totalCount = await WithdrawalRequests.countDocuments();
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

    // Checks for valid user
    const validUser = await User.findById(req.user._id);
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const userWithdrawalRequests = await WithdrawalRequests.find({
      userId: validUser._id,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const userWithdrawalRequests_ = userWithdrawalRequests.map(
      (userWithdrawalRequest) => {
        const {
          _id,
          charges,
          withdrawalAmount,
          status,
          bankDetails,
          createdAt,
        } = userWithdrawalRequest;

        const formattedRequest = {
          id: _id,
          charges,
          amount: withdrawalAmount + charges,
          status,
          bankDetails,
          date: createdAt,
        };

        return formattedRequest;
      }
    );

    const totalCount = await WithdrawalRequests.countDocuments();
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
    const { id: userId, withdrawalAmount, charges, password } = req.body;
    if (Number(withdrawalAmount) < 100) {
      const error = ErrorHandler(400, "You cannot withdraw less than ₦100");
      return res.status(400).json(error);
    }

    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    const validUserDetails = await userDetails.findOne({
      userId: req.user._id,
    });
    if (!validUserDetails) {
      const error = ErrorHandler(404, "There's no user details for this user.");
      return res.status(404).json(error);
    }

    // Checks for correct password
    const validPassword =
      password && bcryptjs.compareSync(password, validUser.password || "");
    if (!validPassword) {
      const error = ErrorHandler(401, "Wrong credentials");
      return res.status(401).json(error);
    }

    // Checks for valid amount
    const validAmount =
      Number(withdrawalAmount) + Number(charges) <=
      Number(validUserDetails.userEarnings.balance);
    if (!validAmount) {
      const error = ErrorHandler(406, "Insufficient balance");
      return res.status(406).json(error);
    }

    // Updates balance and amount withdrawn
    const newUserBalance =
      Number(validUserDetails.userEarnings.balance) -
      Number(withdrawalAmount) -
      Number(charges);
    const newUserAmountWithdrawn =
      Number(validUserDetails.userEarnings.amountWithdrawn) +
      Number(withdrawalAmount) +
      Number(charges);
    await validUserDetails.updateOne({
      userEarnings: {
        ...validUserDetails.userEarnings,
        balance: newUserBalance,
        amountWithdrawn: newUserAmountWithdrawn,
      },
    });

    const newWithdrawalRequests = new WithdrawalRequests({
      userId,
      withdrawalAmount,
      charges,
      status: "pending",
      bankDetails: validUserDetails.bankDetails,
    });
    await newWithdrawalRequests.save();

    // Creates notitfication
    const notification = {
      userId: userId,
      title: "Withdrawal Requested!",
      message: `Your withdrawal request of ₦${numeral(withdrawalAmount).format(
        "0,0.00"
      )} has been received and would be reviewed by the support. Visit the earning page to continue earning while your withdrawal is being processed.`,
      type: "withdraw",
    };

    // Send notification to user
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

    // Updating our own withdrawal request
    await WithdrawalRequests.findByIdAndUpdate(id, {
      $set: { status: "approved" },
    });

    // Creates notitfication
    const notification = {
      userId: userId,
      title: "Withdrawal Approved",
      message: `Congratulations, your withdrawal of ₦${numeral(amount).format(
        "0,0.00"
      )} has been approved. Kindly check your withdrawal history and your local bank account balance for confirmation.`,
      type: "withdraw",
    };

    // Send notification to user
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
    const { amount, userId, id, reason, charges, returnAmount } = req.body;

    // Checks for valid user details
    const validUserDetails = await userDetails.findOne({
      userId,
    });
    if (!validUserDetails) {
      const error = ErrorHandler(404, "There's no user details for this user.");
      return res.status(404).json(error);
    }

    // Updates balance and amount withdrawn
    const newUserBalance =
      Number(validUserDetails.userEarnings.balance) +
      Number(amount) +
      Number(charges);
    const newUserAmountWithdrawn =
      Number(validUserDetails.userEarnings.amountWithdrawn) -
      Number(amount) -
      Number(charges);

    if (returnAmount) {
      await validUserDetails.updateOne({
        userEarnings: {
          ...validUserDetails.userEarnings,
          balance: newUserBalance,
          amountWithdrawn: newUserAmountWithdrawn,
        },
      });
    }

    // Updating our own withdrawal request
    await WithdrawalRequests.findByIdAndUpdate(id, {
      $set: { status: "disapproved" },
    });

    // Creates notitfication
    const notification = {
      userId: userId,
      title: "Withdrawal Disapproved",
      message: `Oops, your withdrawal of ₦${numeral(amount).format(
        "0,0.00"
      )} has been disapproved ${reason}, kindly check your withdrawal history for confirmation.`,
      type: "withdraw",
    };

    // Send notification to user
    await sendNotitfication(notification);

    return res
      .status(200)
      .json({ failed: false, message: "Withdrawal disapproved successfully" });
  } catch (error) {
    next(error);
  }
};
