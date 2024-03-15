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
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return ErrorHandler(404, "User not found");
    const validPassword =
      password && bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return ErrorHandler(401, "Wrong credentials");
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000);
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
