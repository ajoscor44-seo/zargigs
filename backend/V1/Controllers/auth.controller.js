import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { firstname, lastname, username, email, password, referredBy, role } =
    req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    firstname,
    lastname,
    username,
    email,
    password: hashedPassword,
    referredBy,
    role: role || "user",
  });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};
