import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorResponse from "./errorMiddleware";
import User from "../models/userModel";

// Extend Request object to include user
interface AuthRequest extends Request {
  user?: any;
}

// Protect Route Middleware
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Extract token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized, no token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Fetch user from database, excluding password
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return next(new ErrorResponse("User not found", 404));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized, token failed", 401));
  }
};
