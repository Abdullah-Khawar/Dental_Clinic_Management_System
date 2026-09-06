import jwt from "jsonwebtoken";
import { unauthorizedResponse } from "../lib/httpResponse.js";

const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return unauthorizedResponse(res, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return unauthorizedResponse(res, "Invalid token");
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return unauthorizedResponse(res, "Access denied");
    }

    next();
  };
};

export { protect, authorize };
