import Complaint from "../Models/complaint.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const postComplaint = async (req, res, next) => {
  const { complaint, proof } = req.body;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const newComplaint = new Complaint({
      createdBy: req.user._id,
      complaint,
      screenshot: proof,
      isResolved: false,
    });

    await newComplaint.save();
    return res.status(200).json({ failed: false, message: "Complaint Posted" });
  } catch (error) {
    next(error);
  }
};

export const getAllComplaint = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const { status } = req.query;

  const complaintQuery = {};
  if (status == "pending") complaintQuery.isResolved = false;
  if (status == "resolved") complaintQuery.isResolved = true;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const complaints = await Complaint.find(complaintQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    const complaints_ = await Promise.all(
      complaints.map(async (complaint) => {
        const { updatedAt, createdBy, createdAt, __v, _id, ...rest } =
          complaint?.toObject();
        const complaintPoster = await User.findOne({ _id: createdBy });
        const {
          updatedAt: posterUAt,
          createdBy: posterCBy,
          createdAt: posterCAt,
          __v: posterV,
          _id: posterId,
          ...posterDetails
        } = complaintPoster?.toObject();

        return {
          id: _id,
          ...posterDetails,
          ...rest,
        };
      })
    );

    const totalCount = await Complaint.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: complaints_,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserComplaint = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const complaints = await Complaint.find({ createdBy: req.user._id })
      .skip((page - 1) * limit)
      .limit(limit);

    const complaints_ = await Promise.all(
      complaints.map(async (complaint) => {
        const {
          updatedAt,
          createdBy,
          createdAt,
          isResolved,
          __v,
          _id,
          ...rest
        } = complaint?.toObject();
        const complaintPoster = await User.findOne({ _id: createdBy });
        const {
          updatedAt: posterUAt,
          createdBy: posterCBy,
          createdAt: posterCAt,
          __v: posterV,
          _id: posterId,
          ...posterDetails
        } = complaintPoster?.toObject();

        return {
          id: _id,
          ...posterDetails,
          ...rest,
        };
      })
    );

    const totalCount = await Complaint.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: complaints_,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resolveComplaint = async (req, res, next) => {
  const { id } = req.query;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const complaint = await Complaint.findOneAndUpdate(
      { _id: id },
      {
        isResolved: true,
      }
    );

    if (!complaint) {
      const error = ErrorHandler(404, "Complaint not found");
      return res.status(404).json(error);
    }

    return res.status(200).json({
      failed: false,
      message: "Complaint resolved",
    });
  } catch (error) {
    next(error);
  }
};
