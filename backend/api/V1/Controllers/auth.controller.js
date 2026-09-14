import { userService, tokenService, notificationService } from "../services/supabaseDb.service.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";
import { sendNotitfication } from "../utils/notification.js";
import logger from "../utils/logger.util.js";
import { randStr } from "../utils/rand-str.js";

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
      accountType,
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
    const userWithMail = await userService.findByEmail(email);
    let referrer = await userService.findByUsername(referredBy);
    // If NO referrer makes an admin referrer
    if (!referrer) referrer = await userService.findAdmin();

    if (userWithMail) {
      const error = ErrorHandler(400, "Email is already taken");
      return res.status(400).json(error);
    }
    const userWithUsername = await userService.findByUsername(formattedUsername);
    if (userWithUsername) {
      const error = ErrorHandler(400, "Username is already taken.");
      return res.status(400).json(error);
    }

    const newUser = await userService.createUser({
      firstname,
      lastname,
      username: formattedUsername,
      email,
      phone,
      accountType: accountType === "advertiser" || accountType === "retailer" ? "advertiser" : "earner",
      password: hashedPassword,
      referredBy:
        referrer && referrer.username !== "logical"
          ? formattedRefUsername
          : "admin",
      role: "user",
      isEmailVerified: true,
      isMember: false,
      isBanned: false,
      isNINVerified: false,
      referrals: [],
    });

    if (referrer) {
      const currentReferrals = Array.isArray(referrer.referrals) ? referrer.referrals : [];
      await userService.updateUser(referrer.id, {
        referrals: [...currentReferrals, { userId: newUser.id }],
      });
    }

    res.status(201).json({
      message: "Account created successfully.",
      failed: false,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await userService.findByEmail(email);
    if (!validUser) {
      const error = ErrorHandler(404, "User not found");
      return res.status(404).json(error);
    }
    // Auto-verify user if needed
    if (!validUser.isEmailVerified) {
      try {
        await userService.updateUser(validUser.id, { isEmailVerified: true });
      } catch (e) {
        // Continue
      }
    }
    const validPassword =
      password && bcryptjs.compareSync(password, validUser.password || "");
    if (!validPassword) {
      const error = ErrorHandler(401, "Wrong credentials");
      return res.status(401).json(error);
    }

    const { password: hashedPassword, referrals, ...rest } = validUser;
    const token = jwt.sign({ ...rest, _id: validUser.id }, process.env.JWT_SECRET || "zargigs_secret_jwt_key_2026");

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 7200000,
      })
      .status(200)
      .json({
        message: "Login successful",
        failed: false,
        access_token: token,
      });
  } catch (error) {
    next({ message: "Internal server error. Please try again." });
  }
};

export const google = async (req, res, next) => {
  const { name, email, image, phone } = req.body;

  try {
    const fullName = name ? name.split(" ") : ["User", ""];
    const validUser = await userService.findByEmail(email);
    if (validUser) {
      const { password: hashedPassword, ...rest } = validUser;
      const token = jwt.sign({ ...rest, _id: validUser.id }, process.env.JWT_SECRET || "zargigs_secret_jwt_key_2026");
      return res
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
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = await userService.createUser({
        firstname: fullName[0],
        lastname: fullName[1] || "",
        username:
          (name || "user").split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email,
        phone,
        password: hashedPassword,
        referredBy: "admin",
        role: "user",
        isEmailVerified: true,
        isMember: false,
        isBanned: false,
        avatarUrl: image,
      });

      const token = jwt.sign({ ...newUser, _id: newUser.id }, process.env.JWT_SECRET || "zargigs_secret_jwt_key_2026", {
        expiresIn: "1h",
      });
      const { password: hashedPassword2, ...rest } = newUser;
      const expiryDate = new Date(Date.now() + 3600000);
      return res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json({ ...rest, access_token: token });
    }
  } catch (error) {
    next(error);
  }
};

export const sendOTP = async (email, OTP, lastname) => {
  try {
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

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Account Verification",
      html: `
        <div class="border border-green-500 rounded-md px-10 text-center">
          <h1 class="text-green-500 font-bold">Welcome to Zargigs ${lastname || ""}!</h1>
          <p>Here is your OTP</p>
          <h2 class="text-green-500">${OTP}</h2>
          <p>Copy and paste the OTP to verify your Zargigs account.</p>
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
    const validUser = await userService.findByEmail(email);

    if (!validUser) {
      const error = ErrorHandler(404, "User does not exist.");
      return res.status(404).json(error);
    }

    const validOTP = await tokenService.findToken(validUser.id, otp);
    if (!validOTP) {
      const error = ErrorHandler(400, "Invalid OTP.");
      return res.status(400).json(error);
    }

    await userService.updateUser(validUser.id, { isEmailVerified: true });
    await tokenService.deleteTokensByUser(validUser.id);

    // Notification
    const notification = {
      userId: validUser.id,
      title: "Email Verified!",
      message: `Congratulations ${validUser.firstname}, your email ${validUser.email} has been verified, you can now login into your Zargigs account.`,
      type: "verification",
    };

    await sendNotitfication(notification);

    res.status(200).json({ message: "Email Verified", failed: false });
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const email = req.body.email;
    const validUser = await userService.findByEmail(email);
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    await tokenService.deleteTokensByUser(validUser.id);

    const tokenVal = `${Math.floor(1000 + Math.random() * 9000)}`;
    await tokenService.createToken(validUser.id, tokenVal);

    await sendOTP(email, tokenVal, validUser.lastname);
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

    await transporter.sendMail({
      from: process.env.USER,
      to: process.env.USER,
      subject: "Mail From Landing Page",
      html: `
        <div class="border border-green-500 rounded-md px-10 text-center">
          <h1 class="text-green-500 font-bold">Hi Zargigs, my name is ${fullname}</h1>
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
    const validUser = await userService.findByEmail(email);

    if (!validUser) {
      return res
        .status(404)
        .json({ message: "User not found, please confirm the email." });
    }

    const reset_id = randStr(10);
    await tokenService.createResetId(email, reset_id);

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

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Reset Password Link",
      html: `
        <div class="border border-green-500 rounded-md px-10 text-center">
          <h1 class="text-green-500 font-bold">Hello there,</h1>
          <h2 class="text-green-500 font-bold">Seems like your are trying to change your zargigs account password</h2>
          <p>Click the button below to reset your password</p>
          <a href="https://app.zargigs.com/forgot-password/${reset_id}"><button className="px-2 py-1 rounded text-lg font-bold">Change Password</button></a>
          <p>Or copy this link and paste to your browser to reset your password</p>
          <a href="https://app.zargigs.com/forgot-password/${reset_id}">https://app.zargigs.com/forgot-password/${reset_id}</a>
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
    const validResetId = await tokenService.findResetId(resetId);
    if (!validResetId || validResetId.email !== email) {
      return res.status(404).json({ message: "Invalid parameter" });
    }
    await tokenService.deleteResetId(resetId);
    const hashedPassword = newPassword && bcryptjs.hashSync(newPassword, 10);
    const user = await userService.findByEmail(email);
    if (user) {
      await userService.updateUser(user.id, { password: hashedPassword });
    }

    return res
      .status(200)
      .json({ message: "Password has been updated successfully." });
  } catch (error) {
    next(error);
  }
};
