// API Error Handler
// This module provides error handling utilities for API calls

export interface APIError extends Error {
  status?: number;
  code?: string;
}

export class UnauthorizedError extends Error {
  status = 401;
  constructor(message = "You must be logged in to access this resource") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  status = 403;
  constructor(message = "You do not have permission to access this resource") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  status = 404;
  constructor(message = "The requested resource was not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ServerError extends Error {
  status = 500;
  constructor(message = "An error occurred on the server") {
    super(message);
    this.name = "ServerError";
  }
}

/**
 * Parse and enhance API errors with proper types
 */
export function parseAPIError(response: Response, errorData: any): APIError {
  const message = errorData?.error || errorData?.message || "An error occurred";

  let error: APIError;

  switch (response.status) {
    case 401:
      error = new UnauthorizedError(message);
      break;
    case 403:
      error = new ForbiddenError(message);
      break;
    case 404:
      error = new NotFoundError(message);
      break;
    case 500:
    case 502:
    case 503:
      error = new ServerError(message);
      break;
    default:
      error = new Error(message) as APIError;
      error.status = response.status;
  }

  return error;
}

/**
 * Get a user-friendly message for an error
 */
export function getUserFriendlyErrorMessage(error: any): string {
  if (error instanceof UnauthorizedError) {
    return "Please log in to continue";
  }

  if (error instanceof ForbiddenError) {
    return "You don't have permission to perform this action";
  }

  if (error instanceof NotFoundError) {
    return "The item you're looking for doesn't exist";
  }

  if (error instanceof ServerError) {
    return "Server error. Please try again later";
  }

  return error?.message || "An unexpected error occurred";
}
