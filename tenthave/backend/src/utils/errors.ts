import { logger } from "@/config/logger";

// ============================================================================
// CUSTOM ERROR CLASS
// ============================================================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// ============================================================================
// SPECIFIC ERROR TYPES
// ============================================================================

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 400, true, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401, true, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, 403, true, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, true, "NOT_FOUND_ERROR");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, true, "CONFLICT_ERROR");
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, true, "RATE_LIMIT_ERROR");
    this.name = "RateLimitError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, 500, true, "DATABASE_ERROR");
    this.name = "DatabaseError";
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = "External service error") {
    super(`${service}: ${message}`, 502, true, "EXTERNAL_SERVICE_ERROR");
    this.name = "ExternalServiceError";
  }
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

export const handleAsyncError = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const handleDatabaseError = (error: any): AppError => {
  // Prisma error handling
  if (error.code) {
    switch (error.code) {
      case "P2002":
        return new ConflictError(
          "A record with this information already exists"
        );
      case "P2025":
        return new NotFoundError("Record");
      case "P2003":
        return new ValidationError("Invalid reference to related record");
      case "P2014":
        return new ValidationError("Invalid relation operation");
      default:
        return new DatabaseError(`Database error: ${error.message}`);
    }
  }

  // Generic database error
  return new DatabaseError(error.message || "Database operation failed");
};

export const handleValidationError = (error: any): AppError => {
  if (error.name === "ValidationError") {
    return new ValidationError(error.message);
  }

  if (error.name === "CastError") {
    return new ValidationError(`Invalid ${error.path}: ${error.value}`);
  }

  return new ValidationError("Validation failed");
};

export const handleJWTError = (error: any): AppError => {
  if (error.name === "JsonWebTokenError") {
    return new AuthenticationError("Invalid token");
  }

  if (error.name === "TokenExpiredError") {
    return new AuthenticationError("Token has expired");
  }

  return new AuthenticationError("Token verification failed");
};

// ============================================================================
// ERROR LOGGING
// ============================================================================

export const logError = (error: Error, context?: any): void => {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  };

  if (error instanceof AppError && error.statusCode >= 500) {
    logger.error("Application Error:", errorInfo);
  } else if (error instanceof AppError) {
    logger.warn("Client Error:", errorInfo);
  } else {
    logger.error("Unexpected Error:", errorInfo);
  }
};

// ============================================================================
// ERROR RESPONSE FORMATTER
// ============================================================================

export const formatErrorResponse = (
  error: Error,
  isDevelopment: boolean = false
) => {
  const baseResponse = {
    success: false,
    message: error.message,
  };

  if (error instanceof AppError) {
    return {
      ...baseResponse,
      statusCode: error.statusCode,
      code: error.code,
      ...(isDevelopment && { stack: error.stack }),
    };
  }

  // For unexpected errors, don't expose internal details in production
  return {
    ...baseResponse,
    statusCode: 500,
    message: isDevelopment ? error.message : "Internal server error",
    ...(isDevelopment && { stack: error.stack }),
  };
};

// ============================================================================
// COMMON ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_EXPIRED: "Token has expired",
  TOKEN_INVALID: "Invalid token",
  ACCESS_DENIED: "Access denied",
  ACCOUNT_DEACTIVATED: "Account is deactivated",

  // Validation
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please provide a valid email address",
  INVALID_PASSWORD:
    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
  INVALID_PHONE: "Please provide a valid phone number",
  INVALID_URL: "Please provide a valid URL",

  // Resources
  USER_NOT_FOUND: "User not found",
  PRAYER_REQUEST_NOT_FOUND: "Prayer request not found",
  SERMON_NOT_FOUND: "Sermon not found",
  SERIES_NOT_FOUND: "Sermon series not found",
  SERVICE_NOT_FOUND: "Service not found",
  MINISTRY_NOT_FOUND: "Ministry not found",

  // Conflicts
  EMAIL_EXISTS: "User with this email already exists",
  DUPLICATE_ENTRY: "A record with this information already exists",

  // File upload
  FILE_TOO_LARGE: "File size exceeds maximum allowed size",
  INVALID_FILE_TYPE: "Invalid file type",
  UPLOAD_FAILED: "File upload failed",

  // External services
  EMAIL_SERVICE_ERROR: "Email service is currently unavailable",
  DATABASE_CONNECTION_ERROR: "Database connection failed",

  // Rate limiting
  TOO_MANY_REQUESTS: "Too many requests, please try again later",

  // General
  INTERNAL_SERVER_ERROR: "Internal server error",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable",
} as const;

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  // Authentication & Authorization
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  REQUIRED_FIELD: "REQUIRED_FIELD",
  INVALID_FORMAT: "INVALID_FORMAT",

  // Resources
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  DUPLICATE_ERROR: "DUPLICATE_ERROR",

  // Database
  DATABASE_ERROR: "DATABASE_ERROR",
  CONNECTION_ERROR: "CONNECTION_ERROR",

  // External services
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  EMAIL_SERVICE_ERROR: "EMAIL_SERVICE_ERROR",

  // Rate limiting
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",

  // File operations
  FILE_ERROR: "FILE_ERROR",
  UPLOAD_ERROR: "UPLOAD_ERROR",

  // General
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;
