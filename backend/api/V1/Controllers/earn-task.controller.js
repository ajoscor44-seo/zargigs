import EarnAdvert from "../Models/earn-advert.model.js";
import EarnEngagement from "../Models/earn-engagement.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const getAdvertEarners = async (req, res, next) => {
  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const advert_earners = await EarnAdvert.find({});

    const advert_earners_ = advert_earners.map((advert_earner) => {
      const { updatedAt, createdAt, __v, _id, ...rest } =
        advert_earner?.toObject();

      return {
        id: _id,
        ...rest,
      };
    });

    return res.status(200).json({
      failed: false,
      data: advert_earners_,
    });
  } catch (error) {
    next(error);
  }
};

export const postAdvertEarner = async (req, res, next) => {
  try {
    //
  } catch (error) {
    next(error);
  }
};

export const updateAdvertEarner = async (req, res, next) => {
  try {
    //
  } catch (error) {
    next(error);
  }
};

export const getEngagementEarners = async (req, res, next) => {
  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const engagement_earners = await EarnEngagement.find({});

    const engagement_earners_ = engagement_earners.map((engagement_earner) => {
      const { updatedAt, createdAt, __v, _id, ...rest } =
        engagement_earner?.toObject();

      return {
        id: _id,
        ...rest,
      };
    });

    return res.status(200).json({
      failed: false,
      data: engagement_earners_,
    });
  } catch (error) {
    next(error);
  }
};

export const postEngagementEarner = async (req, res, next) => {
  try {
    //
  } catch (error) {
    next(error);
  }
};

export const updateEngagementEarner = async (req, res, next) => {
  try {
    //
  } catch (error) {
    next(error);
  }
};
