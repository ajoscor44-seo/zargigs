import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/error.js";
import Token from "../Models/Token.model.js";
import nodemailer from "nodemailer";
import AccessToken from "../Models/access-tokens.model.js";
import { sendNotitfication } from "../utils/notification.js";
import useExternalApi from "../utils/client.js";
import logger from "../utils/logger.util.js";
import { randStr } from "../utils/rand-str.js";
import ResetId from "../Models/resetid.model.js";

export const signup = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      referredBy,
      phone,
    } = req.body;
    const formattedUsername = username
      ?.replaceAll(" ", "")
      ?.toLowerCase()
      ?.replaceAll("@", "");
    const formattedRefUsername = referredBy
      ?.replaceAll(" ", "")
      ?.toLowerCase()
      ?.replaceAll("@", "");
    const hashedPassword = password && bcryptjs.hashSync(password, 10);
    const userWithMail = await User.findOne({ email });
    let referrer = await User.findOne({ username: referredBy });
    //If NO referrer makes an admin referrer
    if (!referrer) referrer = await User.findOne({ role: "admin" });
    if (userWithMail) {
      const error = ErrorHandler(400, "Email is already taken");
      return res.status(400).json(error);
    }
    const userWithUsername = await User.findOne({
      username: formattedUsername,
    });
    if (userWithUsername) {
      const error = ErrorHandler(400, "Username is already taken.");
      return res.status(400).json(error);
    }
    const newUser = new User({
      firstname,
      lastname,
      username: formattedUsername,
      email,
      phone,
      password: hashedPassword,
      referredBy:
        referrer && referrer.username !== "logical"
          ? formattedRefUsername
          : "admin",
      role: "user",
      isEmailVerified: false,
      isMember: false,
      isBanned: false,
    });
    await newUser.save();

    if (referrer) {
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
      return res.status(401).json(error);
    }
    const validPassword =
      password && bcryptjs.compareSync(password, validUser.password || "");
    if (!validPassword) {
      const error = ErrorHandler(401, "Wrong credentials");
      return res.status(401).json(error);
    }
    const { password: hashedPassword, referrals, ...rest } = validUser._doc;
    const token = jwt.sign({ ...rest }, process.env.JWT_SECRET);

    const baseUrl =
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_MONICREDIT_API
        : process.env.LIVE_MONICREDIT_API;

    const cred = {
      email: process.env.USER,
      password: process.env.PASSWORD,
    };
    const authRes = await useExternalApi(
      `${baseUrl}/core/auth/login`,
      "POST",
      cred
    );

    if (!authRes.success) {
      return next();
    }
    await AccessToken.findOneAndUpdate(
      { username: validUser.username },
      {
        username: validUser.username,
        email,
        accessToken: authRes.accessToken,
      },
      { new: true, upsert: true }
    );

    return res
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
  const { name, email, image, phone } = req.body;

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
        phone,
        password: hashedPassword,
        referredBy: "admin",
        role: "user",
        isEmailVerified: false,
        isMember: false,
        isBanned: false,
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
    return logger.error("Email fail to send.");
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

    // Creates notitfication
    const notification = {
      userId: validOTP.userId,
      title: "Email Verified!",
      message: `Congratulations ${validUser.firstname}, your email ${validUser.email} has been verified, you can now login into your Gigsflix account.`,
      type: "verification",
    };

    // Send notification to user
    await sendNotitfication(notification);

    res.status(200).json({ message: "Email Verified", failed: false });
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const email = req.body.email;
    const validUser = await User.findOne({ email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    await Token.findOneAndDelete({ userId: validUser._id });

    // Generate OTP token
    const OTPToken = new Token({
      userId: validUser._id,
      token: `${Math.floor(1000 + Math.random() * 9000)}`,
    });
    await OTPToken.save();

    await sendOTP(email, OTPToken.token, validUser.lastname);
    res
      .status(200)
      .json({ message: "OTP has been resent successfully", failed: false });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).send({ message: "Logged Out!!", failed: false });
  } catch (error) {
    next(error);
  }
};

export const sendEmail = async (req, res, next) => {
  try {
    const { email, message, fullname } = req.body;
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
      to: process.env.USER,
      subject: "Mail From Landing Page",
      html: `
        <div class="border border-green-500 rounded-md px-10 text-center">
          <h1 class="text-green-500 font-bold">Hi Gigsflix, my name is ${fullname}</h1>
          <h2 class="text-green-500 font-bold">Sender Email: ${email}</h2>
          <p>${message}</p>
        </div>
      `,
    });

    return res.status(200).json({
      message: "Your message has been delivered successfully",
      failed: false,
    });
  } catch (error) {
    res
      .status(406)
      .json({ message: "Unable to send your message", failed: false });
    return logger.error("Email fail to send.");
  }
};

export const sendResetPasswordLink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res
        .status(404)
        .json({ message: "User not found, please confirm the email." });
    }

    const reset_id = randStr(10);
    const resetId = new ResetId({
      email,
      resetId: reset_id,
    });
    await resetId.save();

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
      subject: "Reset Password Link",
      html: `
        <div class="border border-green-500 rounded-md px-10 text-center">
          <h1 class="text-green-500 font-bold">Hello there,</h1>
          <h2 class="text-green-500 font-bold">Seems like your are trying to change your gigsflix account password</h2>
          <p>Click the button below to reset your password</p>
          <a href="https://app.gigsflix.com/forgot-password/${reset_id}"><button className="px-2 py-1 rounded text-lg font-bold">Change Password</button></a>
          <p>Or copy this link and paste to your browser to reset your password</p>
          <a href="https://app.gigsflix.com/forgot-password/${reset_id}">https://app.gigsflix.com/forgot-password/${reset_id}</a>
        </div>
      `,
    });

    return res
      .status(200)
      .json({ message: "A password reset link has been sent to your mail." });
  } catch (error) {
    res
      .status(406)
      .json({ message: "Unable to send your message", failed: false });
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, resetId, password: newPassword } = req.body;
    const validResetId = await ResetId.findOneAndDelete({
      email,
      resetId,
    });
    if (!validResetId) {
      return res.status(404).json({ message: "Invalid parameter" });
    }
    const hashedPassword = newPassword && bcryptjs.hashSync(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    return res
      .status(200)
      .json({ message: "Password has been updated successfully." });
  } catch (error) {
    next(error);
  }
};
