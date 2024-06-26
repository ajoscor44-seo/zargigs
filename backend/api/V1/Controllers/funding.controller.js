import Funding from "../Models/funding.model.js";
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
  // Verifies request
  logRequestDetails(req);

  const transData = req.body;

  const user = await User.findOne({ email: transData.data.customer_email });
  const userId = user._id;
  try {
    // Update fundings list
    const newFunding = new Funding({
      userId,
      date: transData.data.date_paid,
      amount: transData.data.amount,
      payment_gateway: "Autocredit",
      payment_method: transData.data.channel,
      status: transData.data.status,
      orderId: transData.data.orderid,
      transId: transData.data.transid,
    });
    await newFunding.save();

    // Creates notitfication
    const notification = {
      userId,
      title: "Funding Successful",
      message: `Your funding of ₦${numeral(transData.data.amount).format(
        "0,0.00"
      )} is successfu. Check your balance for confirmation.`,
      type: "fund",
    };
    await sendNotitfication(notification);

    return res.status(200).json({
      failed: false,
      message: "Wallet funded successfully.",
      data: {
        amount,
      },
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
      const { updatedAt, __v, _id, ...rest } = funding.toObject();
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
