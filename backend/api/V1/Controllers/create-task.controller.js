import CreateAdvert from "../Models/create-advert.model.js";
import CreateEngagement from "../Models/create-engagement.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const getAdvertCreators = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const advert_creators = await CreateAdvert.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const advert_creators_ = advert_creators.map((advert_creator) => {
      const { updatedAt, createdAt, __v, _id, ...rest } =
        advert_creator?.toObject();

      return {
        id: _id,
        ...rest,
      };
    });

    const totalCount = await CreateAdvert.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: advert_creators_,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const postAdvertCreator = async (req, res, next) => {
  try {
    //
  } catch (error) {
    next(error);
  }
};

export const updateAdvertCreator = async (req, res, next) => {
  try {
    const { id: creatorId, amount } = req.query;

    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const createAdvert = await CreateAdvert.findByIdAndUpdate(creatorId, {
      amountToPay: amount,
    });

    if (!createAdvert) {
      const error = ErrorHandler(404, "Pricing way not found");
      return res.status(404).json(error);
    }

    return res.status(200).json({
      failed: false,
      message: "Amount Updated",
    });
  } catch (error) {
    next(error);
  }
};

export const getEngagementCreators = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const engagement_creators = await CreateEngagement.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const engagement_creators_ = engagement_creators.map(
      (engagement_creator) => {
        const { updatedAt, createdAt, __v, _id, ...rest } =
          engagement_creator?.toObject();

        return {
          id: _id,
          ...rest,
        };
      }
    );

    const totalCount = await CreateEngagement.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: engagement_creators_,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const postEngagementCreator = async (req, res, next) => {
  try {
    //
  } catch (error) {
    next(error);
  }
};

export const updateEngagementCreator = async (req, res, next) => {
  try {
    const { id: creatorId, amount } = req.query;

    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const createEngagement = await CreateEngagement.findByIdAndUpdate(
      creatorId,
      {
        amountToPay: amount,
      }
    );

    if (!createEngagement) {
      const error = ErrorHandler(404, "Pricing way not found");
      return res.status(404).json(error);
    }

    return res.status(200).json({
      failed: false,
      message: "Amount Updated",
    });
  } catch (error) {
    next(error);
  }
};
