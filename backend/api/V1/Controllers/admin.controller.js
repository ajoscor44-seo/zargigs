import Admin from "../Models/admin.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const setAdminData = async (req, res, next) => {
  try {
    const {
      appName,
      membershipFee,
      withdrawalCharges,
      minimumFollowers,
      appLogo,
    } = req.body;

    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const admin_data = new Admin({
      createdBy: req.user._id,
      appName,
      membershipFee,
      withdrawalCharges,
      minimumFollowers,
      appLogo,
    });

    admin_data.save();

    return res.status(200).json({
      failed: false,
      message: "Admin data set successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminData = async (req, res, next) => {
  try {
    const {
      appName,
      appLogo,
      membershipFee,
      withdrawalCharges,
      businessMail,
      minimumFollowers,
    } = req.body;

    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const adminDataToBeUpdated = {};
    if (appName) adminDataToBeUpdated.appName = appName;
    if (appLogo) adminDataToBeUpdated.appLogo = appLogo;
    if (membershipFee) adminDataToBeUpdated.membershipFee = membershipFee;
    if (withdrawalCharges)
      adminDataToBeUpdated.withdrawalCharges = withdrawalCharges;
    if (businessMail) adminDataToBeUpdated.businessMail = businessMail;
    if (minimumFollowers)
      adminDataToBeUpdated.minimumFollowers = minimumFollowers;

    const updatedAdminData = await Admin.findOneAndUpdate(
      {},
      adminDataToBeUpdated
    );

    if (!updatedAdminData) {
      const error = ErrorHandler(404, "No admin data to update.");
      return res.status(200).json(error);
    }

    return res.status(200).json({
      failed: false,
      message: "Admin data updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminData = async (req, res, next) => {
  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const adminData = await Admin.find();

    if (!adminData) {
      const error = ErrorHandler(404, "No admin data.");
      return res.status(404).json(error);
    }

    return res.status(200).json(adminData);
  } catch (error) {
    next(error);
  }
};
