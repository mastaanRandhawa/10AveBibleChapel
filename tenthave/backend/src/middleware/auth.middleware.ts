import { Request, Response, NextFunction } from "express";
import { authService } from "@/services/auth.service";
import { prisma } from "@/config/database";
import { logger } from "@/config/logger";
import { AuthRequest, JWTPayload, UserRole } from "@/types";
import { AuthenticationError, AuthorizationError } from "@/utils/errors";
import {
  authRateLimit,
  passwordResetRateLimit,
  emailVerificationRateLimit,
  prayerRequestRateLimit,
  fileUploadRateLimit,
} from "./rateLimit.middleware";

// Re-export rate limits for convenience
export {
  authRateLimit,
  passwordResetRateLimit,
  emailVerificationRateLimit,
  prayerRequestRateLimit,
  fileUploadRateLimit,
};

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("No token provided");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new AuthenticationError("No token provided");
    }

    // Verify token
    const decoded = await authService.verifyToken(token);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        dateOfBirth: true,
        memberSince: true,
        lastLoginAt: true,
        isEmailVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    if (!user.isActive) {
      throw new AuthenticationError("Account is deactivated");
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      memberSince: user.memberSince,
      lastLoginAt: user.lastLoginAt,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    req.token = token;

    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    next(error);
  }
};

// ============================================================================
// AUTHORIZATION MIDDLEWARE
// ============================================================================

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentication required");
      }

      if (!roles.includes(req.user.role)) {
        throw new AuthorizationError(
          `Access denied. Required roles: ${roles.join(", ")}`
        );
      }

      next();
    } catch (error) {
      logger.error("Authorization error:", error);
      next(error);
    }
  };
};

// ============================================================================
// ROLE-SPECIFIC MIDDLEWARE
// ============================================================================

export const requireAdmin = authorize(UserRole.ADMIN);
export const requireMember = authorize(UserRole.ADMIN, UserRole.MEMBER);
export const requireGuest = authorize(
  UserRole.ADMIN,
  UserRole.MEMBER,
  UserRole.GUEST
);

// ============================================================================
// OPTIONAL AUTHENTICATION
// ============================================================================

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token provided, continue without authentication
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next();
    }

    try {
      // Try to verify token
      const decoded = await authService.verifyToken(token);

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          address: true,
          dateOfBirth: true,
          memberSince: true,
          lastLoginAt: true,
          isEmailVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          address: user.address,
          dateOfBirth: user.dateOfBirth,
          memberSince: user.memberSince,
          lastLoginAt: user.lastLoginAt,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        req.token = token;
      }
    } catch (error) {
      // Token is invalid, but we continue without authentication
      logger.warn("Optional auth failed:", error);
    }

    next();
  } catch (error) {
    logger.error("Optional authentication error:", error);
    next(error);
  }
};

// ============================================================================
// EMAIL VERIFICATION MIDDLEWARE
// ============================================================================

export const requireEmailVerification = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    if (!req.user.isEmailVerified) {
      throw new AuthorizationError("Email verification required");
    }

    next();
  } catch (error) {
    logger.error("Email verification check error:", error);
    next(error);
  }
};

// ============================================================================
// RESOURCE OWNERSHIP MIDDLEWARE
// ============================================================================

export const requireOwnership = (resourceUserIdField: string = "userId") => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentication required");
      }

      // Admin can access any resource
      if (req.user.role === UserRole.ADMIN) {
        return next();
      }

      // Check if user owns the resource
      const resourceUserId =
        req.params[resourceUserIdField] || req.body[resourceUserIdField];

      if (!resourceUserId) {
        throw new AuthorizationError("Resource user ID not found");
      }

      if (req.user.id !== resourceUserId) {
        throw new AuthorizationError(
          "Access denied - you can only access your own resources"
        );
      }

      next();
    } catch (error) {
      logger.error("Resource ownership check error:", error);
      next(error);
    }
  };
};

// ============================================================================
// PRAYER REQUEST PERMISSION MIDDLEWARE
// ============================================================================

export const checkPrayerRequestPermission = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const prayerRequestId = req.params.id;

    if (!prayerRequestId) {
      throw new AuthorizationError("Prayer request ID not found");
    }

    // Admin can access any prayer request
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    // Check if user has permission to view this prayer request
    const permission = await prisma.prayerPermission.findUnique({
      where: {
        prayerRequestId_userId: {
          prayerRequestId,
          userId: req.user.id,
        },
      },
    });

    if (!permission || !permission.canView) {
      throw new AuthorizationError(
        "Access denied - you do not have permission to view this prayer request"
      );
    }

    next();
  } catch (error) {
    logger.error("Prayer request permission check error:", error);
    next(error);
  }
};

// ============================================================================
// RATE LIMITING BY USER
// ============================================================================

export const userRateLimit = (
  maxRequests: number = 10,
  windowMs: number = 60000
) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        return next();
      }

      const userId = req.user.id;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean up old entries
      for (const [key, value] of requests.entries()) {
        if (value.resetTime < windowStart) {
          requests.delete(key);
        }
      }

      // Get or create user request record
      let userRequests = requests.get(userId);

      if (!userRequests || userRequests.resetTime < windowStart) {
        userRequests = { count: 0, resetTime: now };
        requests.set(userId, userRequests);
      }

      // Check if user has exceeded rate limit
      if (userRequests.count >= maxRequests) {
        const resetTime = new Date(userRequests.resetTime + windowMs);
        res.setHeader("X-RateLimit-Limit", maxRequests.toString());
        res.setHeader("X-RateLimit-Remaining", "0");
        res.setHeader("X-RateLimit-Reset", resetTime.toISOString());

        throw new AuthorizationError(
          `Rate limit exceeded. Try again after ${resetTime.toISOString()}`
        );
      }

      // Increment request count
      userRequests.count++;

      // Set rate limit headers
      res.setHeader("X-RateLimit-Limit", maxRequests.toString());
      res.setHeader(
        "X-RateLimit-Remaining",
        (maxRequests - userRequests.count).toString()
      );
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(userRequests.resetTime + windowMs).toISOString()
      );

      next();
    } catch (error) {
      logger.error("User rate limit error:", error);
      next(error);
    }
  };
};

// ============================================================================
// REQUEST LOGGING MIDDLEWARE
// ============================================================================

export const logUserActivity = (action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (req.user) {
        logger.info(`User activity: ${req.user.email} - ${action}`, {
          userId: req.user.id,
          userRole: req.user.role,
          action,
          ip: req.ip,
          userAgent: req.get("User-Agent"),
          timestamp: new Date().toISOString(),
        });
      }
      next();
    } catch (error) {
      logger.error("User activity logging error:", error);
      next(); // Don't fail the request if logging fails
    }
  };
};
