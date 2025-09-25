import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request type to include `user`
interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {

    const token = req.cookies?.token;
    console.log("Cookies received:", req.cookies);
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
