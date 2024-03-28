import UserDetails from "../../V1/Models/user-details.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const getUserDetails = async (req, res, next) => {
  res.json(req.user);
  next();
};

export const addUserDetails = async (req, res, next) => {
  const {
    id,
    email,
    location,
    religion,
    dateOfBirth,
    image,
    bankDetails,
    userEarnings,
  } = req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  // Checks for user details
  const userDetails = await UserDetails.findOne({ userId: id });
  if (userDetails) {
    const error = ErrorHandler(400, "User's details already exists.");
    return res.status(400).json(error);
  }

  // Checks if the user is the owner of account
  if (req.user._id !== id) {
    const error = ErrorHandler(400, "Unauthorized Action.");
    return res.status(400).json(error);
  }

  try {
    const newUserDetails = new UserDetails({
      userId: validUser._id,
      location,
      religion,
      dateOfBirth,
      bankDetails,
      userEarnings,
    });
    if (image) {
      await User.findOneAndUpdate({ email }, { image });
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
  const {
    id,
    email,
    location,
    religion,
    dateOfBirth,
    image,
    bankDetails,
    userEarnings,
  } = req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  // Checks for user details
  const userDetails = await UserDetails.findOne({ userId: id });
  if (!userDetails) {
    const error = ErrorHandler(400, "User's details does not exists.");
    return res.status(400).json(error);
  }

  // Checks if the user is the owner of account
  if (req.user.id !== id) {
    const error = ErrorHandler(400, "Cannot add other user's details.");
    return res.status(400).json(error);
  }

  // Code to update user details
  res.status(200).json("newUserDetails");
  next();
};
