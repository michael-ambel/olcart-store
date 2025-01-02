import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface DecodeTocken {
  _id: string;
  email: string;
  role: "admin" | "customer";
}

export const protectAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Authorization token is missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodeTocken;

    if (decoded.role !== "admin") {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    req.user = { _id: decoded._id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const protectCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Authorization token is missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodeTocken;
    if (decoded.role !== "customer") {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    req.user = { _id: decoded._id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
