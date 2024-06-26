import Funding from "../Models/funding.model.js";
import userDetails from "../Models/user-details.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import { sendNotitfication } from "../utils/notification.js";
import numeral from "numeral";

const logRequestDetails = (req) => {
  console.log("Logging request details:");
  console.log("Request headers:", JSON.stringify(req.headers, null, 2));
  console.log("Request body:", JSON.stringify(req.body, null, 2));
};

export const fundLocalWallet = async (req, res, next) => {
  // Logs request
  logRequestDetails(req);

  const transData = req.body;
  const walletReference = transData.walletReference;

  const userDetails = await userDetails.findOne({
    "walletDetails.reference": walletReference,
  });
  const userId = userDetails.userId;

  try {
    // Update fundings list
    const newFunding = new Funding({
      userId,
      paidOn: transData.paidOn,
      paymentGateway: "Autocredit",
      paymentMethod: transData.paymentMethod,
      status: transData.paymentStatus,
      orderId: transData.order_id,
      transReference: transData.transReference,
      paymentReference: transData.paymentReference,
      sourceAccountNumber: transData.sourceAccountNumber,
      sourceAccountName: transData.sourceAccountName,
      sourceBankName: transData.sourceBankName,
      settlementAmount: transData.settlementAmount,
      amountPaid: transData.amountPaid,
      paymentDescription: transData.paymentDescription,
      walletReference,
    });
    await newFunding.save();

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
        amountPaid,
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
