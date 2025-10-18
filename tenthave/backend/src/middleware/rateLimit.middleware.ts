import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { config } from "@/config";
import { logger } from "@/config/logger";
import { AppError } from "@/utils/errors";

// ============================================================================
// RATE LIMIT STORE (In-memory for development, use Redis for production)
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class MemoryStore {
  private store = new Map<string, RateLimitEntry>();

  increment(
    key: string,
    windowMs: number
  ): { count: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetTime < now) {
      // Create new entry or reset expired entry
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.store.set(key, newEntry);
      return newEntry;
    }

    // Increment existing entry
    entry.count++;
    this.store.set(key, entry);
    return entry;
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key);
      }
    }
  }
}

const memoryStore = new MemoryStore();

// Clean up expired entries every 5 minutes
setInterval(() => {
  memoryStore.cleanup();
}, 5 * 60 * 1000);

// ============================================================================
// CUSTOM RATE LIMIT HANDLER
// ============================================================================

const createRateLimitHandler = (message: string) => {
  return (req: Request, res: Response) => {
    const error = new AppError(message, 429, true, "RATE_LIMIT_ERROR");

    // Set rate limit headers
    const key = req.ip || "unknown";
    const entry = memoryStore.increment(key, config.rateLimit.windowMs);

    res.setHeader("X-RateLimit-Limit", config.rateLimit.maxRequests.toString());
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, config.rateLimit.maxRequests - entry.count).toString()
    );
    res.setHeader("X-RateLimit-Reset", new Date(entry.resetTime).toISOString());
    res.setHeader(
      "Retry-After",
      Math.ceil((entry.resetTime - Date.now()) / 1000).toString()
    );

    logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.originalUrl,
      method: req.method,
    });

    res.status(429).json({
      success: false,
      message: error.message,
      code: error.code,
      retryAfter: Math.ceil((entry.resetTime - Date.now()) / 1000),
    });
  };
};

// ============================================================================
// GENERAL RATE LIMIT
// ============================================================================

export const generalRateLimit = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many requests from this IP, please try again later."
  ),
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === "/health" || req.path === "/api/health";
  },
});

// ============================================================================
// AUTHENTICATION RATE LIMIT (Stricter for login/register)
// ============================================================================

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many authentication attempts, please try again later."
  ),
  skipSuccessfulRequests: true, // Don't count successful requests
});

// ============================================================================
// PASSWORD RESET RATE LIMIT
// ============================================================================

export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: "Too many password reset attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many password reset attempts, please try again later."
  ),
});

// ============================================================================
// EMAIL VERIFICATION RATE LIMIT
// ============================================================================

export const emailVerificationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: "Too many email verification attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many email verification attempts, please try again later."
  ),
});

// ============================================================================
// PRAYER REQUEST RATE LIMIT
// ============================================================================

export const prayerRequestRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 prayer requests per hour
  message: "Too many prayer requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many prayer requests, please try again later."
  ),
});

// ============================================================================
// FILE UPLOAD RATE LIMIT
// ============================================================================

export const fileUploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: "Too many file uploads, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many file uploads, please try again later."
  ),
});

// ============================================================================
// API RATE LIMIT (For API endpoints)
// ============================================================================

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "API rate limit exceeded, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "API rate limit exceeded, please try again later."
  ),
});

// ============================================================================
// STRICT RATE LIMIT (For sensitive operations)
// ============================================================================

export const strictRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: "Too many attempts for this operation, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many attempts for this operation, please try again later."
  ),
});

// ============================================================================
// USER-SPECIFIC RATE LIMIT
// ============================================================================

export const createUserRateLimit = (maxRequests: number, windowMs: number) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    keyGenerator: (req: Request) => {
      // Use user ID if authenticated, otherwise use IP
      return (req as any).user?.id || req.ip || "unknown";
    },
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: createRateLimitHandler(
      "Too many requests, please try again later."
    ),
  });
};

// ============================================================================
// RATE LIMIT BY ENDPOINT
// ============================================================================

export const endpointRateLimits = {
  "/api/auth/login": authRateLimit,
  "/api/auth/register": authRateLimit,
  "/api/auth/forgot-password": passwordResetRateLimit,
  "/api/auth/verify-email": emailVerificationRateLimit,
  "/api/prayer-requests": prayerRequestRateLimit,
  "/api/upload": fileUploadRateLimit,
  "/api/admin": strictRateLimit,
};

// ============================================================================
// RATE LIMIT MIDDLEWARE FACTORY
// ============================================================================

export const createRateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: createRateLimitHandler(
      options.message || "Too many requests, please try again later."
    ),
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    keyGenerator:
      options.keyGenerator || ((req: Request) => req.ip || "unknown"),
  });
};

// ============================================================================
// RATE LIMIT RESET UTILITY
// ============================================================================

export const resetRateLimit = (identifier: string): void => {
  memoryStore.reset(identifier);
};

// ============================================================================
// RATE LIMIT STATUS CHECK
// ============================================================================

export const getRateLimitStatus = (
  identifier: string,
  windowMs: number
): {
  count: number;
  remaining: number;
  resetTime: number;
} => {
  const entry = memoryStore.increment(identifier, windowMs);
  return {
    count: entry.count,
    remaining: Math.max(0, config.rateLimit.maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
};
