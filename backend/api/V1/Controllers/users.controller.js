import UserDetails from "../../V1/Models/user-details.model.js";
import User from "../Models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const users_ = users.map((user) => {
      const {
        updatedAt,
        createdBy,
        createdAt,
        password,
        referrals,
        role,
        isEmailVerified,
        isMembers,
        __v,
        _id,
        ...rest
      } = user?.toObject();

      return {
        id: _id,
        ...rest,
      };
    });
    const totalCount = await User.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: users_,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAUser = async (req, res, next) => {
  const { id } = req.query;

  try {
    const user = await User.findOne({ _id: id });
    const { updatedAt, createdBy, createdAt, password, __v, _id, ...rest } =
      user._doc;

    const user_details = await UserDetails.findOne({ userId: id });
    if (!user_details) {
      return res.status(200).json({
        failed: false,
        data: { ...rest },
      });
    }
    const {
      __v: detailsV,
      _id: detailsId,
      createdAt: detailsCreatedAt,
      updatedAt: detailsUpdatedAt,
      ...detailsRest
    } = user_details._doc;

    return res.status(200).json({
      failed: false,
      data: { id: _id, ...rest, ...detailsRest },
    });
  } catch (error) {
    next(error);
  }
};
