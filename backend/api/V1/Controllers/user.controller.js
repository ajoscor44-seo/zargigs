import UserDetails from "../../V1/Models/user-details.model.js";
import Admin from "../Models/admin.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const getUserDetails = async (req, res, next) => {
  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  // Destructures user object
  const { _id, __v, iat, createdAt, updatedAt, role, ...rest } = req.user;

  const validUserDetails = await UserDetails.findOne({ userId: validUser._id });
  if (!validUserDetails) {
    return res.status(200).json({ ...rest });
  }

  // Destructures user details object
  const {
    userId,
    _id: detailsId,
    __v: detailsV,
    createdAt: detailsCreatedAt,
    updatedAt: detailsUpdatedAt,
    ...details
  } = validUserDetails._doc;

  res.json({ ...rest, ...details, id: _id });
  next();
};

export const addUserDetails = async (req, res, next) => {
  const {
    location,
    religion,
    gender,
    dateOfBirth,
    image,
    bankDetails,
    userEarnings,
  } = req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  // Checks for user details
  const userDetails = await UserDetails.findOne({ userId: validUser._id });
  if (userDetails) {
    const error = ErrorHandler(400, "User's details already exists.");
    return res.status(400).json(error);
  }

  try {
    const newUserDetails = new UserDetails({
      userId: validUser._id,
      location,
      religion,
      gender,
      dateOfBirth,
      bankDetails,
      userEarnings,
    });
    if (image) {
      await User.findOneAndUpdate({ email: req.user.email }, { image });
    }
    await newUserDetails.save();

    res.status(200).json({
      failed: false,
      message: "User details added successfully",
      status: 200,
    });
    next();
  } catch (error) {
    next(error);
  }
};

// Updates user details
export const updateUserDetails = async (req, res, next) => {
  const { location, religion, dateOfBirth, image, bankDetails, userEarnings } =
    req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  // Checks for user details
  const userDetails = await UserDetails.findOne({ userId: req.user._id });
  if (!userDetails) {
    const error = ErrorHandler(400, "User's details does not exists.");
    return res.status(400).json(error);
  }

  // Code to update user details
  res.status(200).json("newUserDetails");
  next();
};

// Updates user details
export const becomeAMember = async (req, res, next) => {
  const { verificationId } = req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  // Verifies Payment
  //
  //
  //

  // Makes user a member
  await User.findOneAndUpdate(
    { userId: req.user._id },
    {
      isMember: true,
    }
  );

  // Response
  res.status(200).json({
    message: "You are now a member",
    failed: false,
  });
  next();
};
