import { Request, Response, NextFunction } from "express";
import { config } from "@/config";
import { logger } from "@/config/logger";
import {
  AppError,
  isOperationalError,
  formatErrorResponse,
  logError,
} from "@/utils/errors";
import { Prisma } from "@prisma/client";

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logError(error, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle different types of errors
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    appError = handlePrismaError(error);
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    appError = new AppError(
      "Invalid data provided",
      400,
      true,
      "VALIDATION_ERROR"
    );
  } else if (error.name === "ValidationError") {
    appError = new AppError(error.message, 400, true, "VALIDATION_ERROR");
  } else if (error.name === "CastError") {
    appError = new AppError(
      "Invalid data format",
      400,
      true,
      "VALIDATION_ERROR"
    );
  } else if (error.name === "JsonWebTokenError") {
    appError = new AppError("Invalid token", 401, true, "AUTHENTICATION_ERROR");
  } else if (error.name === "TokenExpiredError") {
    appError = new AppError(
      "Token has expired",
      401,
      true,
      "AUTHENTICATION_ERROR"
    );
  } else if (error.name === "MulterError") {
    appError = handleMulterError(error);
  } else {
    // Unknown error
    appError = new AppError(
      config.isDevelopment ? error.message : "Internal server error",
      500,
      false,
      "INTERNAL_ERROR"
    );
  }

  // Send error response
  const errorResponse = formatErrorResponse(appError, config.isDevelopment);

  res.status(appError.statusCode).json(errorResponse);
};

// ============================================================================
// PRISMA ERROR HANDLER
// ============================================================================

const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError
): AppError => {
  switch (error.code) {
    case "P2002":
      // Unique constraint violation
      const field = error.meta?.target as string[];
      return new AppError(
        `A record with this ${
          field?.join(", ") || "information"
        } already exists`,
        409,
        true,
        "CONFLICT_ERROR"
      );

    case "P2025":
      // Record not found
      return new AppError("Record not found", 404, true, "NOT_FOUND_ERROR");

    case "P2003":
      // Foreign key constraint violation
      return new AppError(
        "Invalid reference to related record",
        400,
        true,
        "VALIDATION_ERROR"
      );

    case "P2014":
      // Invalid relation operation
      return new AppError(
        "Invalid relation operation",
        400,
        true,
        "VALIDATION_ERROR"
      );

    case "P2016":
      // Query interpretation error
      return new AppError("Invalid query", 400, true, "VALIDATION_ERROR");

    case "P2021":
      // Table does not exist
      return new AppError(
        "Database table not found",
        500,
        true,
        "DATABASE_ERROR"
      );

    case "P2022":
      // Column does not exist
      return new AppError(
        "Database column not found",
        500,
        true,
        "DATABASE_ERROR"
      );

    default:
      return new AppError(
        `Database error: ${error.message}`,
        500,
        true,
        "DATABASE_ERROR"
      );
  }
};

// ============================================================================
// MULTER ERROR HANDLER
// ============================================================================

const handleMulterError = (error: any): AppError => {
  switch (error.code) {
    case "LIMIT_FILE_SIZE":
      return new AppError("File size too large", 413, true, "FILE_ERROR");

    case "LIMIT_FILE_COUNT":
      return new AppError("Too many files", 413, true, "FILE_ERROR");

    case "LIMIT_UNEXPECTED_FILE":
      return new AppError("Unexpected file field", 400, true, "FILE_ERROR");

    case "LIMIT_PART_COUNT":
      return new AppError("Too many parts", 413, true, "FILE_ERROR");

    case "LIMIT_FIELD_KEY":
      return new AppError("Field name too long", 400, true, "FILE_ERROR");

    case "LIMIT_FIELD_VALUE":
      return new AppError("Field value too long", 400, true, "FILE_ERROR");

    case "LIMIT_FIELD_COUNT":
      return new AppError("Too many fields", 413, true, "FILE_ERROR");

    default:
      return new AppError("File upload error", 400, true, "FILE_ERROR");
  }
};

// ============================================================================
// ASYNC ERROR HANDLER
// ============================================================================

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ============================================================================
// 404 HANDLER
// ============================================================================

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    true,
    "NOT_FOUND_ERROR"
  );
  next(error);
};

// ============================================================================
// UNHANDLED REJECTION HANDLER
// ============================================================================

export const handleUnhandledRejection = (): void => {
  process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);

    // Close server gracefully
    process.exit(1);
  });
};

// ============================================================================
// UNCAUGHT EXCEPTION HANDLER
// ============================================================================

export const handleUncaughtException = (): void => {
  process.on("uncaughtException", (error: Error) => {
    logger.error("Uncaught Exception:", error);

    // Close server gracefully
    process.exit(1);
  });
};

// ============================================================================
// GRACEFUL SHUTDOWN HANDLER
// ============================================================================

export const handleGracefulShutdown = (server: any): void => {
  const gracefulShutdown = (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    server.close(() => {
      logger.info("HTTP server closed.");

      // Close database connection
      process.exit(0);
    });

    // Force close server after 10 seconds
    setTimeout(() => {
      logger.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

// ============================================================================
// VALIDATION ERROR HANDLER
// ============================================================================

export const handleValidationError = (error: any): AppError => {
  if (error.details) {
    const messages = error.details
      .map((detail: any) => detail.message)
      .join(", ");
    return new AppError(
      `Validation error: ${messages}`,
      400,
      true,
      "VALIDATION_ERROR"
    );
  }

  return new AppError(
    error.message || "Validation failed",
    400,
    true,
    "VALIDATION_ERROR"
  );
};

// ============================================================================
// RATE LIMIT ERROR HANDLER
// ============================================================================

export const handleRateLimitError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(
    "Too many requests, please try again later",
    429,
    true,
    "RATE_LIMIT_ERROR"
  );

  res.setHeader("Retry-After", "60"); // Retry after 60 seconds
  next(error);
};

// ============================================================================
// CORS ERROR HANDLER
// ============================================================================

export const handleCorsError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError("CORS policy violation", 403, true, "CORS_ERROR");
  next(error);
};

// ============================================================================
// SECURITY HEADERS MIDDLEWARE
// ============================================================================

export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Remove X-Powered-By header
  res.removeHeader("X-Powered-By");

  // Set security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self'; " +
      "frame-ancestors 'none';"
  );

  next();
};

// ============================================================================
// REQUEST LOGGING MIDDLEWARE
// ============================================================================

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      logger.warn("HTTP Request:", logData);
    } else {
      logger.info("HTTP Request:", logData);
    }
  });

  next();
};
