import Funding from "../Models/funding.model.js";
import userDetails from "../Models/user-details.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import { sendNotitfication } from "../utils/notification.js";
import numeral from "numeral";

export const fundLocalWallet = async (req, res, next) => {
  try {
    const transData = req.body;
    console.log(req);
    const collection = transData.type === "COLLECTION";
    const walletReference = transData.walletReference;
    if (!collection) {
      return res.status(200).json({ failed: false, message: "Wallet funded" });
    }

    const amountFunded = await Funding.findOne({
      paymentReference: transData.paymentReference,
    });
    if (amountFunded) {
      return res.status(200).json({ failed: false, message: "Wallet funded" });
    }

    const UserDetails = await userDetails.findOne({
      "walletDetails.reference": walletReference,
    });
    const userId = UserDetails?.userId;

    // Update fundings list
    const newFunding = new Funding({
      userId,
      paidOn: transData.paidOn,
      paymentGateway: "Autocredit",
      paymentMethod: transData.paymentMethod,
      status: transData.paymentStatus,
      orderId: transData.order_id,
      transReference: transData.transactionReference,
      paymentReference: transData.paymentReference,
      sourceAccountNumber: transData.sourceAccountNumber,
      sourceAccountName: transData.sourceAccountName,
      sourceBankName: transData.sourceBankName,
      settlementAmount: Number(transData.settlementAmount),
      amountPaid: Number(transData.amountPaid),
      paymentDescription: transData.paymentDescription,
      walletReference,
    });
    await newFunding.save();

    // Updates referrer earning details
    UserDetails.userEarnings = {
      ...UserDetails.userEarnings,
      balance:
        Number(UserDetails.userEarnings.balance) + Number(transData.amountPaid),
    };
    UserDetails.walletDetails = {
      ...UserDetails.walletDetails,
      balance:
        Number(UserDetails.walletDetails.balance) +
        Number(transData.amountPaid),
    };
    // Saves referrer details
    await UserDetails.save();

    // Creates notitfication
    const notification = {
      userId,
      title: "Funding Successful",
      message: `Your funding of ₦${numeral(Number(transData.amountPaid)).format(
        "0,0.00"
      )} is successful. Check your balance for confirmation.`,
      type: "fund",
    };
    await sendNotitfication(notification);

    return res.status(200).json({
      failed: false,
      message: "Wallet funded successfully.",
      data: {},
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getFundings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const Fundings = await Funding.find({ userId: req.user._id })
      .skip((page - 1) * limit)
      .limit(limit);

    const fundings = Fundings.map((funding) => {
      const {
        updatedAt,
        transReference,
        paymentReference,
        orderId,
        settlementAmount,
        walletReference,
        userId,
        __v,
        _id,
        ...rest
      } = funding.toObject();
      return { id: _id, ...rest };
    });

    const totalCount = await Funding.countDocuments({ userId: req.user._id });
    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      data: fundings,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getFunding = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const funding = await Funding.findById(id);
    if (!funding) {
      const error = ErrorHandler(404, "Funding details not found");
      return res.status(404).json(error);
    }

    const {
      updatedAt,
      orderId,
      amountPaid,
      walletReference,
      userId,
      __v,
      _id,
      ...rest
    } = funding.toObject();

    const newFundingObj = {
      id: _id,
      ...rest,
    };

    const response = {
      failed: false,
      data: newFundingObj,
      message: "Funding Details",
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
