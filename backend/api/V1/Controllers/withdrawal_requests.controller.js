import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";
import WithdrawalRequests from "../Models/withdrawal_requests.model.js";
import userDetails from "../Models/user-details.model.js";

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
      .skip((page - 1) * limit)
      .limit(limit);

    const allWithdrawalRequests_ = allWithdrawalRequests.map(
      (withdrawalRequest) => {
        const { updatedAt, createdAt, __v, _id, ...rest } =
          withdrawalRequest?.toObject();

        return {
          id: _id,
          ...rest,
        };
      }
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
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    //
  } catch (error) {
    next(error);
  }
};

export const postWithdrawalRequests = async (req, res, next) => {
  try {
    const { id: userId, withdrawalAmount, charges, password } = req.body;

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

    // Checks for correct password
    const validAmount =
      withdrawalAmount + charges <= validUserDetails.userEarnings.balance;
    if (!validAmount) {
      const error = ErrorHandler(406, "Insufficient balance");
      return res.status(406).json(error);
    }

    // Updates balance and amount withdrawn
    const newUserBalance =
      validUserDetails.userEarnings.balance - withdrawalAmount - charges;
    const newUserAmountWithdrawn =
      validUserDetails.userEarnings.amountWithdrawn + withdrawalAmount;
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
    });
    await newWithdrawalRequests.save();

    if (!newWithdrawalRequests) {
      const error = ErrorHandler(500, "Error making request");
      return res.status(500).json(error);
    }

    return res.status(200).json({
      failed: false,
      message: "Withdrawal Requested. Please wait for approval.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateWithdrawalRequests = async (req, res, next) => {
  try {
    //
  } catch (error) {
    next(error);
  }
};
