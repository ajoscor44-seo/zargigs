import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    referredBy,
    role,
    isEmailVerified,
    isMember,
  } = req.body;
  const hashedPassword = password && bcryptjs.hashSync(password, 10);
  const newUser = new User({
    firstname,
    lastname,
    username,
    email,
    password: hashedPassword,
    referredBy,
    role: role || "user",
    isEmailVerified,
    isMember,
  });
  try {
    const userWithMail = await User.findOne({ email });
    if (userWithMail) {
      const error = ErrorHandler(400, "Email is already taken");
      return res.status(400).json(error);
    }
    const userWithUsername = await User.findOne({ username });
    if (userWithUsername) {
      const error = ErrorHandler(400, "Username is already taken");
      return res.status(400).json(error);
    }
    await newUser.save();
    res.status(201).json({
      status: "Signup successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      const error = ErrorHandler(404, "User not found");
      return res.status(404).json(error);
    }
    const validPassword =
      password && bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      const error = ErrorHandler(401, "Wrong credentials");
      return res.status(401).json(error);
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000);
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({ ...rest, id: validUser._id });
  } catch (error) {
    next(error);
  }
};
