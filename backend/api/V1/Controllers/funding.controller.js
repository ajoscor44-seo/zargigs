import Funding from "../Models/funding.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const fundUserWallet = async (req, res, next) => {
  try {
    const { date, amount, paymentGateway, paymentMethod } = req.body;

    const fundingLength = await Funding.countDocuments();
    const newFunding = new Funding({
      sn: fundingLength + 1,
      date,
      amount,
      payment_gateway: paymentGateway,
      payment_method: paymentMethod,
      status: "pending",
    });

    await newFunding.save();

    return res.json({ message: "Wallet funded successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateFunding = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    const funding = await Funding.findById(id);

    if (!funding) {
      const error = ErrorHandler(404, "Funding does not exist.");
      return res.status(404).json(error);
    }

    funding.status = status;
    await funding.save();
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
