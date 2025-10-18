// Core types for the 10th Avenue Bible Chapel backend
import { Request } from "express";
import {
  User,
  UserRole,
  PrayerRequest,
  PrayerStatus,
  PrayerCategory,
  PrayerPriority,
  ContentStatus,
  ServiceType,
} from "@prisma/client";

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: SafeUser;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  user: SafeUser;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface UserCreateData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
}

export interface UserUpdateData {
  name?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  memberSince?: Date;
  lastLoginAt?: Date;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PRAYER REQUEST TYPES
// ============================================================================

export interface PrayerRequestCreateData {
  title: string;
  description: string;
  requester?: string;
  category: PrayerCategory;
  priority: PrayerPriority;
  isPrivate: boolean;
  userId?: string;
}

export interface PrayerRequestUpdateData {
  title?: string;
  description?: string;
  requester?: string;
  category?: PrayerCategory;
  priority?: PrayerPriority;
  status?: PrayerStatus;
  isPrivate?: boolean;
  isAnswered?: boolean;
  answerNotes?: string;
}

export interface PrayerRequestWithUser extends PrayerRequest {
  user?: User;
  permissions?: PrayerPermission[];
}

export interface PrayerPermission {
  id: string;
  prayerRequestId: string;
  userId: string;
  canView: boolean;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SERMON TYPES
// ============================================================================

export interface SermonCreateData {
  title: string;
  subtitle?: string;
  description?: string;
  speaker: string;
  date: Date;
  youtubeUrl?: string;
  audioUrl?: string;
  thumbnail?: string;
  passage?: string;
  seriesId?: string;
  status?: ContentStatus;
  isFeatured?: boolean;
  order?: number;
  metaDescription?: string;
}

export interface SermonUpdateData {
  title?: string;
  subtitle?: string;
  description?: string;
  speaker?: string;
  date?: Date;
  youtubeUrl?: string;
  audioUrl?: string;
  thumbnail?: string;
  passage?: string;
  seriesId?: string;
  status?: ContentStatus;
  isFeatured?: boolean;
  order?: number;
  metaDescription?: string;
}

export interface SermonSeriesCreateData {
  title: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
  startDate?: Date;
  endDate?: Date;
  metaDescription?: string;
}

export interface SermonSeriesUpdateData {
  title?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
  startDate?: Date;
  endDate?: Date;
  metaDescription?: string;
}

// ============================================================================
// SERVICE & MINISTRY TYPES
// ============================================================================

export interface ServiceCreateData {
  name: string;
  description: string;
  icon?: string;
  type: ServiceType;
  isActive?: boolean;
  order?: number;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  zoomLink?: string;
  meetingId?: string;
  passcode?: string;
}

export interface ServiceUpdateData {
  name?: string;
  description?: string;
  icon?: string;
  type?: ServiceType;
  isActive?: boolean;
  order?: number;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  zoomLink?: string;
  meetingId?: string;
  passcode?: string;
}

export interface MinistryCreateData {
  name: string;
  description: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
  schedule?: string;
  location?: string;
  ageRange?: string;
}

export interface MinistryUpdateData {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
  schedule?: string;
  location?: string;
  ageRange?: string;
}

// ============================================================================
// CONTENT MANAGEMENT TYPES
// ============================================================================

export interface AboutSectionCreateData {
  title: string;
  content: string;
  status?: ContentStatus;
  order?: number;
  metaDescription?: string;
}

export interface AboutSectionUpdateData {
  title?: string;
  content?: string;
  status?: ContentStatus;
  order?: number;
  metaDescription?: string;
}

export interface ContactInfoUpdateData {
  phone?: string;
  email?: string;
  address?: string;
  mapUrl?: string;
  sundayHours?: string;
  wednesdayHours?: string;
  otherHours?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  additionalInfo?: string;
}

// ============================================================================
// FILE UPLOAD TYPES
// ============================================================================

export interface FileUploadResult {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

export interface UploadConfig {
  maxSize: number;
  allowedTypes: string[];
  destination: string;
}

// ============================================================================
// EMAIL TYPES
// ============================================================================

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface SearchQuery {
  q?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  speaker?: string;
  series?: string;
}

export interface PrayerRequestFilters {
  status?: PrayerStatus[];
  category?: PrayerCategory[];
  priority?: PrayerPriority[];
  isPrivate?: boolean;
  isAnswered?: boolean;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SermonFilters {
  status?: ContentStatus[];
  isFeatured?: boolean;
  seriesId?: string;
  speaker?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// ============================================================================
// AUDIT TRAIL TYPES
// ============================================================================

export interface ContentEditData {
  entityType: string;
  entityId: string;
  fieldName: string;
  oldValue?: string;
  newValue?: string;
  userId: string;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface SiteConfigData {
  key: string;
  value: string;
  description?: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// ============================================================================
// MIDDLEWARE TYPES
// ============================================================================

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

export interface CorsConfig {
  origin: string | string[] | boolean;
  credentials?: boolean;
  methods?: string[];
  allowedHeaders?: string[];
}

// ============================================================================
// RE-EXPORT PRISMA TYPES
// ============================================================================

export type {
  User,
  PrayerRequest,
  PrayerStatus,
  PrayerCategory,
  PrayerPriority,
  ContentStatus,
  ServiceType,
  Service,
  Ministry,
  Sermon,
  SermonSeries,
  AboutSection,
  ContactInfo,
  MediaFile,
  SiteConfig,
  ContentEdit,
} from "@prisma/client";

export { UserRole } from "@prisma/client";

// Safe user type without sensitive fields
export type SafeUser = Omit<
  User,
  | "passwordHash"
  | "emailVerificationToken"
  | "passwordResetToken"
  | "passwordResetExpires"
>;
