import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/error.js";
import Token from "../Models/Token.model.js";
import nodemailer from "nodemailer";
import AccessToken from "../Models/access-tokens.model.js";

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
    username: username.toLowerCase(),
    email,
    password: hashedPassword,
    referredBy: referredBy.toLowerCase(),
    role: role || "user",
    isEmailVerified,
    isMember,
  });
  try {
    const userWithMail = await User.findOne({ email });
    const referrer = await User.findOne({ username: referredBy });
    if (userWithMail) {
      const error = ErrorHandler(400, "Email is already taken");
      return res.status(400).json(error);
    }
    const userWithUsername = await User.findOne({ username });
    if (userWithUsername) {
      const error = ErrorHandler(400, "Username is already taken.");
      return res.status(400).json(error);
    }
    await newUser.save();

    if (referrer && referrer !== "admin") {
      await referrer.updateOne({
        referrals: [
          ...referrer.referrals,
          {
            userId: newUser._id,
          },
        ],
      });
    }

    // Generate OTP token
    const OTPToken = new Token({
      userId: newUser._id,
      token: `${Math.floor(1000 + Math.random() * 9000)}`,
    });
    await OTPToken.save();

    // Send OTP mail
    await sendOTP(email, OTPToken.token, lastname);
    res.status(201).json({
      message: "Email sent successfully.",
      failed: false,
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
      const error = ErrorHandler(400, "Please verify your email to continue.");
      // Generate OTP token
      const OTPToken = new Token({
        userId: validUser._id,
        token: `${Math.floor(1000 + Math.random() * 9000)}`,
      });
      await OTPToken.save();

      // Send OTP mail
      await sendOTP(email, OTPToken.token, validUser.lastname);
      res.status(401).json(error);
    }
    const validPassword =
      password && bcryptjs.compareSync(password, validUser.password || "");
    if (!validPassword) {
      const error = ErrorHandler(401, "Wrong credentials");
      return res.status(401).json(error);
    }
    const { password: hashedPassword, ...rest } = validUser._doc;
    const token = jwt.sign({ ...rest }, process.env.JWT_SECRET);
    const accessToken = new AccessToken({
      username: validUser.username,
      email,
      accessToken: token,
    });
    await accessToken.save();

    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 7200000,
      })
      .status(200)
      .json({
        message: "Login successful",
        failed: false,
      });
  } catch (error) {
    next({ message: "Internal server error. Please try again." });
  }
};

export const google = async (req, res, next) => {
  const { name, email, isEmailVerified, image, referredBy, role, isMember } =
    req.body;

  try {
    const fullName = name.split(" ");
    const validUser = await User.findOne({ email: email });
    if (validUser) {
      const { password: hashedPassword, ...rest } = validUser._doc;
      const token = jwt.sign({ ...rest }, process.env.JWT_SECRET);
      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 3600000,
        })
        .status(200)
        .json({
          message: "Login successful",
          failed: false,
          access_token: token,
        });
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

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
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
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    // Sends Email
    let info = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Account Verification",
      html: `
        <div class="border border-green-500 rounded-md px-10 text-center">
          <h1 class="text-green-500 font-bold">Welcome to Gigsflix ${lastname}!</h1>
          <p>Here is your OTP</p>
          <h2 class="text-green-500">${OTP}</h2>
          <p>Copy and paste the OTP to verify your Gigsflix account.</p>
        </div>
      `,
    });
  } catch (error) {
    const err = ErrorHandler(500, "Email failed to send");
    console.log(error, err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const validUser = await User.findOne({ email });

    if (!validUser) {
      const error = ErrorHandler(404, "User does not exist.");
      return res.status(404).json(error);
    }

    const validOTP = await Token.findOne({
      token: otp,
    });

    if (!validOTP) {
      const error = ErrorHandler(404, "Invalid OTP.");
      return res.status(400).json(error);
    }
    await User.updateOne(
      { _id: validOTP.userId },
      { $set: { isEmailVerified: true } }
    );
    await Token.findByIdAndDelete(validOTP._id);

    res.status(200).json({ message: "Email Verified", failed: false });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).send("Logged out!");
  } catch (error) {
    next(error);
  }
};
