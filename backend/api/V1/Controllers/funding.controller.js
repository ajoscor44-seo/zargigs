import Funding from "../Models/funding.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import useExternalApi from "../utils/client.js";
import { randStr } from "../utils/rand-str.js";
import { sendNotitfication } from "../utils/notification.js";
import userDetails from "../Models/user-details.model.js";
import numeral from "numeral";

export const initiateFunding = async (req, res, next) => {
  const amount = req.body.amount;

  try {
    const orderId = randStr(10);
    const baseUrl =
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_MONICREDIT_API
        : process.env.LIVE_MONICREDIT_API;
    const pubKey =
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_PUB_KEY
        : process.env.PROD_PUB_KEY;
    const revHead =
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_REV_HEAD
        : process.env.PROD_REV_HEAD;

    const transData = {
      order_id: orderId,
      public_key: pubKey,
      customer: {
        first_name: req.user.firstname,
        last_name: req.user.lastname,
        email: req.user.email,
        phone: "0" + req.user.phone,
      },
      items: [
        {
          item: "Fund Wallet",
          revenue_head_code: revHead,
          unit_cost: amount,
        },
      ],
      currency: "NGN",
      paytype: "standard",
    };

    const transRes = await useExternalApi(
      `${baseUrl}/payment/transactions/init-transaction`,
      "POST",
      transData,
      null,
      { accept: "application/json" }
    );

    const transId = transRes.id;
    const transInfo = await useExternalApi(
      `${baseUrl}/payment/transactions/init-transaction-info/${transId}`,
      "GET",
      {},
      null,
      {}
    );
    console.log(transInfo);

    const {
      customer_id,
      customer_email,
      balance,
      wallet_id,
      credit,
      debit,
      reference,
      ...rest
    } = transInfo.data.customer;

    return res.status(200).json({
      failed: false,
      message: "Transaction Initiated successfully.",
      data: {
        id: transId,
        amountToPay:
          Number(transInfo.data.total_amount) + Number(transInfo.data.charges),
        ...rest,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyFunding = async (req, res, next) => {
  try {
    const { id, amount } = req.body;
    const validUserDetails = await userDetails.findOne({
      userId: req.user._id,
    });
    if (!validUserDetails) {
      return res
        .status(200)
        .json({ failed: false, message: "User details not found" });
    }

    const baseUrl =
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_MONICREDIT_API
        : process.env.LIVE_MONICREDIT_API;

    const priKey =
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_PRI_KEY
        : process.env.PROD_PRI_KEY;

    const verfData = {
      transaction_id: id,
      private_key: priKey,
    };

    const verfRes = await useExternalApi(
      `${baseUrl}/payment/transactions/verify-payment`,
      "POST",
      verfData,
      null,
      {}
    );
    console.log(verfRes);

    if (!verfRes.status) {
      return res.status(406).json({ failed: true, message: verfRes.message });
    }
    if (verfRes.data.amount < amount) {
      return res
        .status(406)
        .json({ failed: true, message: "Payment Insufficient" });
    }

    // Update fundings list
    const newFunding = new Funding({
      date: verfRes.data.date_paid,
      amount: verfRes.data.amount,
      payment_gateway: "Autocredit",
      payment_method: verfRes.data.channel,
      status: verfRes.data.status,
      order_id: verfRes.data.orderid,
      trans_id: verfRes.data.transid,
    });
    await newFunding.save();

    // Creates notitfication
    notification = {
      userId: req.user._id,
      title: "Funding Successful",
      message: `Your funding of ₦${numeral(verfRes.data.amount).format(
        "0,0.00"
      )} has been reviewed and has been APPROVED, check your balance for confirmation.`,
      type: "fund",
    };

    // Update user earnings
    validUserDetails.userEarnings = {
      ...validUserDetails.userEarnings,
      balance:
        Number(validUserDetails.userEarnings.balance) +
        Number(verfRes.data.amount),
    };
    validUserDetails.walletDetails = {
      ...validUserDetails.walletDetails,
      balance:
        Number(validUserDetails.walletDetails.balance) +
        Number(verfRes.data.amount),
    };
    await validUserDetails.save();
    // Send notification to user
    await sendNotitfication(notification);

    return res
      .status(200)
      .json({ failed: false, message: "Wallet funding " + verfRes.message });
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

    const Fundings = await Funding.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const fundings = Fundings.map((funding) => {
      const { updatedAt, __v, _id, ...rest } = funding.toObject();
      return { id: _id, ...rest };
    });

    const totalCount = await Funding.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      data: fundings,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    };

    return res.json(response);
  } catch (error) {
    next(error);
  }
};
