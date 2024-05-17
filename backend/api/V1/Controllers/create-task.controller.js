import CreateAdvert from "../Models/create-advert.model.js";
import CreateEngagement from "../Models/create-engagement.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const getAdvertCreators = async (req, res, next) => {
  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const advert_creators = await CreateAdvert.find({});

    const advert_creators_ = advert_creators.map((advert_creator) => {
      const { updatedAt, createdAt, __v, _id, ...rest } =
        advert_creator?.toObject();

      return {
        id: _id,
        ...rest,
      };
    });

    return res.status(200).json({
      failed: false,
      data: advert_creators_,
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
    //
  } catch (error) {
    next(error);
  }
};

export const getEngagementCreators = async (req, res, next) => {
  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const engagement_creators = await CreateEngagement.find({});

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

    return res.status(200).json({
      failed: false,
      data: engagement_creators_,
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
    //
  } catch (error) {
    next(error);
  }
};
