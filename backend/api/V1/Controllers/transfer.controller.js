import Transfer from "../Models/transfer.model.js";
import bcryptjs from "bcryptjs";
import numeral from "numeral";
import User from "../Models/user.model.js ";
import { ErrorHandler } from "../utils/error.js";
import userDetails from "../Models/user-details.model.js";
import { sendNotitfication } from "../utils/notification.js";

export const makeTransfer = async (req, res, next) => {
  try {
    const { receiver, amount, password, charges } = req.body;
    const receiverU = await User.findOne({ username: receiver.toLowerCase() });
    const validUser = await User.findOne({ _id: req.user._id });
    const validUserDetails = await userDetails.findOne({
      userId: req.user._id,
    });
    const validReceiverDetails = await userDetails.findOne({
      userId: receiverU._id,
    });

    if (!validUserDetails) {
      const error = ErrorHandler(404, "User details does not exist.");
      return res.status(404).json(error);
    }

    if (!validReceiverDetails) {
      const error = ErrorHandler(404, "Receiver details does not exist.");
      return res.status(404).json(error);
    }

    if (!receiverU) {
      const error = ErrorHandler(404, "Receiver does not exist.");
      return res.status(404).json(error);
    }

    // Validates password
    const validPassword =
      password && bcryptjs.compareSync(password, validUser.password || "");
    if (!validPassword) {
      const error = ErrorHandler(401, "Wrong Password");
      return res.status(401).json(error);
    }

    // Validates amount to be transferred
    const validAmount =
      validUserDetails.userEarnings.balance > amount + charges;
    if (!validAmount) {
      const error = ErrorHandler(406, "Insufficient balance");
      return res.status(406).json(error);
    }

    // Stores transfer
    const newTransfer = new Transfer({
      sender: req.user._id,
      senderUsername: req.user.username,
      receiver: receiverU._id,
      receiverUsername: receiverU.username,
      amountSent: amount,
      status: "pending",
    });
    await newTransfer.save();

    // Updates balances and amount withdrawn
    const newUserBalance =
      validUserDetails.userEarnings.balance - amount - charges;
    const newUserAmountWithdrawn =
      validUserDetails.userEarnings.amountWithdrawn + amount + charges;
    const newReceiverBalance =
      validReceiverDetails.userEarnings.balance + amount;

    // Updates users balances
    await validUserDetails.updateOne({
      userEarnings: {
        ...validUserDetails.userEarnings,
        balance: newUserBalance,
        amountWithdrawn: newUserAmountWithdrawn,
      },
    });
    await validReceiverDetails.updateOne({
      userEarnings: {
        ...validReceiverDetails.userEarnings,
        balance: newReceiverBalance,
      },
    });
    await Transfer.findByIdAndUpdate(newTransfer._id, { status: "successful" });

    // Sends notification to users
    const senderNotitfication = {
      userId: req.user._id,
      title: "Transfer Successful",
      message: `Your transfer of ₦${numeral(amount).format("0,0.00")} to ${
        receiverU.username
      } is successful.`,
      type: "verification",
    };
    const receiverNotitfication = {
      userId: receiverU._id,
      title: "Credit Alert!",
      message: `You just received ₦${numeral(amount).format("0,0.00")} from ${
        req.user.username
      }. Check your balance and transfer history for confirmation.`,
      type: "withdraw",
    };

    // Send notification to user
    await sendNotitfication(receiverNotitfication);
    await sendNotitfication(senderNotitfication);

    return res
      .status(200)
      .json({ failed: false, message: "Transfer successful" });
  } catch (error) {
    next(error);
  }
};

export const getUserTransfers = async (req, res, next) => {
  try {
    const transfers = await Transfer.find({
      $or: [
        { sender: req.user._id, senderUsername: req.user.username },
        { receiver: req.user._id, receiverUsername: req.user.username },
      ],
    });

    if (!transfers) {
      const error = ErrorHandler(404, "No transfer history");
      return res.status(404).json(error);
    }

    const transfers_ = transfers.map((transfer) => {
      const { __v, _id, updatedAt, sender, receiver, ...rest } =
        transfer.toObject();

      return {
        id: _id,
        ...rest,
      };
    });

    return res.status(200).json({
      failed: false,
      data: transfers_,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransfers = async (req, res, next) => {
  try {
    //
  } catch (error) {
    next(error);
  }
};
