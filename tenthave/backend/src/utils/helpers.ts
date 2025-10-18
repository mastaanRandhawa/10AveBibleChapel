import crypto from "crypto";
import slugify from "slugify";
import { Request } from "express";
import { PaginationQuery, PaginationMeta } from "@/types";

// ============================================================================
// CRYPTO UTILITIES
// ============================================================================

export const generateRandomToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString("hex");
};

export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// ============================================================================
// SLUG UTILITIES
// ============================================================================

export const createSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

export const createUniqueSlug = (
  text: string,
  existingSlugs: string[]
): string => {
  let slug = createSlug(text);
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${createSlug(text)}-${counter}`;
    counter++;
  }

  return slug;
};

// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

export const calculatePagination = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

export const getPaginationParams = (query: PaginationQuery) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    sortBy: query.sortBy || "createdAt",
    sortOrder: query.sortOrder || "desc",
  };
};

// ============================================================================
// DATE UTILITIES
// ============================================================================

export const formatDate = (
  date: Date,
  format: string = "YYYY-MM-DD"
): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

export const isDateInRange = (
  date: Date,
  startDate?: Date,
  endDate?: Date
): boolean => {
  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;
  return true;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

// ============================================================================
// STRING UTILITIES
// ============================================================================

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  return text.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
};

// ============================================================================
// URL UTILITIES
// ============================================================================

export const extractYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const generateYouTubeThumbnail = (
  videoId: string,
  quality: "default" | "medium" | "high" | "standard" | "maxres" = "medium"
): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ============================================================================
// FILE UTILITIES
// ============================================================================

export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith("image/");
};

export const isDocumentFile = (mimeType: string): boolean => {
  const documentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  return documentTypes.includes(mimeType);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// ============================================================================
// REQUEST UTILITIES
// ============================================================================

export const getClientIp = (req: Request): string => {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    (req.headers["x-real-ip"] as string) ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "unknown"
  );
};

export const getUserAgent = (req: Request): string => {
  return req.headers["user-agent"] || "unknown";
};

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// ============================================================================
// ERROR UTILITIES
// ============================================================================

export const isOperationalError = (error: Error): boolean => {
  if (error instanceof Error) {
    return (error as any).isOperational === true;
  }
  return false;
};

export const getErrorStack = (error: Error): string => {
  return error.stack || error.message;
};

// ============================================================================
// ENVIRONMENT UTILITIES
// ============================================================================

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

export const isTest = (): boolean => {
  return process.env.NODE_ENV === "test";
};
