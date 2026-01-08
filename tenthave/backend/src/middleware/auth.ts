import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    isApproved?: boolean;
  };
}

// Verify JWT token
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const secret = process.env.JWT_SECRET || "your-secret-key";

    jwt.verify(token, secret, (err: Error | null, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        isApproved: decoded.isApproved,
      };

      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Check if user is admin
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};

// Check if user is approved (or admin who bypasses approval)
export const requireApprovedUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Admins bypass approval requirement
  if (req.user.role === "ADMIN") {
    return next();
  }

  // Check if user is approved
  if (!req.user.isApproved) {
    return res.status(403).json({
      error: "Your account is pending admin approval",
      code: "APPROVAL_REQUIRED",
    });
  }

  next();
};
