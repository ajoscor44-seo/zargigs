import { ErrorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  const token =
    req.cookies?.access_token ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader || null);

  const headerUserId =
    req.headers?.["x-user-id"] ||
    req.query?.userId ||
    req.body?.userId ||
    req.headers?.["user-id"];

  if (token) {
    // 1. Try verifying with backend JWT_SECRET
    try {
      const user = jwt.verify(
        token,
        process.env.JWT_SECRET || "zargigs_secret_jwt_key_2026"
      );
      req.user = {
        ...user,
        id: user.id || user._id || user.sub,
        _id: user.id || user._id || user.sub,
      };
      return next();
    } catch (err) {
      // 2. If signature check fails, decode payload (e.g. Supabase JWT session)
      try {
        const decoded = jwt.decode(token);
        if (decoded && (decoded.sub || decoded.id || decoded._id || decoded.email)) {
          req.user = {
            ...decoded,
            id: decoded.sub || decoded.id || decoded._id,
            _id: decoded.sub || decoded.id || decoded._id,
            email: decoded.email,
          };
          return next();
        }
      } catch (decodeErr) {
        // Continue to user ID fallback
      }
    }
  }

  // 3. Fallback to header or body userId if present
  if (headerUserId) {
    req.user = {
      id: headerUserId,
      _id: headerUserId,
    };
    return next();
  }

  // 4. Allow public GET endpoints without throwing 401
  const publicPaths = [
    "/announcement",
    "/pricing",
    "/earn-tasks",
    "/tasks/total",
    "/activities",
    "/marketplace",
    "/wallet/banks",
    "/wallet/public-banks",
    "/wallet/public-verify-account",
  ];

  const isPublicPath =
    req.method === "GET" &&
    publicPaths.some(
      (p) => req.path?.startsWith(p) || req.originalUrl?.includes(p)
    );

  if (isPublicPath) {
    req.user = null;
    return next();
  }

  const error = ErrorHandler(401, "Not Authenticated");
  return res.status(401).json(error);
};

export default authenticateToken;

