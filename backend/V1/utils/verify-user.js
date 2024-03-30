import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    req.cookie.access_token || (authHeader && authHeader.split(" ")[1]);

  if (!token) {
    res.status(401).json("User not authenticated.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json("Token is not valid");
    }

    req.user = user;
  });
};
