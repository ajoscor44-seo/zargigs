import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/error.js";
import Token from "../Models/Token.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

    // Generate OTP token
    const OTPToken = new Token({
      userId: newUser._id,
      token: `${Math.floor(1000 + Math.random() * 9000)}`,
    });

    console.log(OTPToken);
    await OTPToken.save();

    // Send OTP mail
    await sendOTP(email, OTPToken.token, lastname);
    res.status(201).json({
      status: "Email sent successfully.",
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
    if (!validUser.isEmailVerified) {
      const error = ErrorHandler(404, "Please verify your email to continue.");
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
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, isEmailVerified, image, referredBy, role, isMember } =
    req.body;

  try {
    const fullName = name.split(" ");
    const validUser = await User.findOne({ email: email });
    if (validUser) {
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validUser._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);

      const hashedPassword =
        generatedPassword && bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        firstname: fullName[0],
        lastname: fullName[1],
        username:
          name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email,
        password: hashedPassword,
        referredBy,
        role: role || "user",
        isEmailVerified,
        isMember,
        image,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const sendOTP = async (email, OTP, lastname) => {
  try {
    // Creates Email Transporter
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    // Sends Email
    let info = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Account Verification",
      text: `Welcome to Gigsflix ${lastname}!,`,
      html: `<div>Here is your OTP (${OTP}) to verify your ${process.env.USER} account.</div>`,
    });
  } catch (error) {
    console.log(error, "Email failed to send");
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res
        .status(400)
        .json({ message: "User does not exist.", success: false });
    }

    const validOTP = await Token.findOne({
      token: otp,
    });

    if (!validOTP) {
      return res.status(400).json({ message: "Invalid OTP.", success: false });
    }
    console.log(validOTP);
    await User.updateOne(
      { _id: validOTP.userId },
      { $set: { isEmailVerified: true } }
    );
    await Token.findByIdAndDelete(validOTP._id);

    res.status(200).json({ status: "Email Verified" });
  } catch (error) {
    next(error);
  }
};
