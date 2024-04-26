import { ErrorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (token == null) {
    const error = ErrorHandler(401, "Not Authenticated");
    return res.status(401).json(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "An error occurred" });
    req.user = user;
    next();
  });
};

export default authenticateToken;
