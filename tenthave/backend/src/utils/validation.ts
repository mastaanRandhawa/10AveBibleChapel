import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import {
  UserRole,
  PrayerCategory,
  PrayerPriority,
  PrayerStatus,
  ContentStatus,
  ServiceType,
} from "@prisma/client";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

// User validation schemas
export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  address: Joi.string().max(500).optional().messages({
    "string.max": "Address cannot exceed 500 characters",
  }),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
  }),
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  address: Joi.string().max(500).optional().messages({
    "string.max": "Address cannot exceed 500 characters",
  }),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional(),
  isActive: Joi.boolean().optional(),
});

// Prayer request validation schemas
export const prayerRequestCreateSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot exceed 200 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().min(10).max(2000).required().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),
  requester: Joi.string().max(100).optional().allow("").messages({
    "string.max": "Requester name cannot exceed 100 characters",
  }),
  category: Joi.string()
    .valid(...Object.values(PrayerCategory))
    .required()
    .messages({
      "any.only": "Please select a valid category",
      "any.required": "Category is required",
    }),
  priority: Joi.string()
    .valid(...Object.values(PrayerPriority))
    .default("NORMAL")
    .messages({
      "any.only": "Please select a valid priority",
    }),
  isPrivate: Joi.boolean().default(false),
});

export const prayerRequestUpdateSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional().messages({
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot exceed 200 characters",
  }),
  description: Joi.string().min(10).max(2000).optional().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 2000 characters",
  }),
  requester: Joi.string().max(100).optional().allow("").messages({
    "string.max": "Requester name cannot exceed 100 characters",
  }),
  category: Joi.string()
    .valid(...Object.values(PrayerCategory))
    .optional()
    .messages({
      "any.only": "Please select a valid category",
    }),
  priority: Joi.string()
    .valid(...Object.values(PrayerPriority))
    .optional()
    .messages({
      "any.only": "Please select a valid priority",
    }),
  status: Joi.string()
    .valid(...Object.values(PrayerStatus))
    .optional()
    .messages({
      "any.only": "Please select a valid status",
    }),
  isPrivate: Joi.boolean().optional(),
  isAnswered: Joi.boolean().optional(),
  answerNotes: Joi.string().max(1000).optional().allow("").messages({
    "string.max": "Answer notes cannot exceed 1000 characters",
  }),
});

// Sermon validation schemas
export const sermonCreateSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot exceed 200 characters",
    "any.required": "Title is required",
  }),
  subtitle: Joi.string().max(200).optional().allow("").messages({
    "string.max": "Subtitle cannot exceed 200 characters",
  }),
  description: Joi.string().max(2000).optional().allow("").messages({
    "string.max": "Description cannot exceed 2000 characters",
  }),
  speaker: Joi.string().min(2).max(100).required().messages({
    "string.min": "Speaker name must be at least 2 characters long",
    "string.max": "Speaker name cannot exceed 100 characters",
    "any.required": "Speaker is required",
  }),
  date: Joi.date().required().messages({
    "date.base": "Please provide a valid date",
    "any.required": "Date is required",
  }),
  youtubeUrl: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid YouTube URL",
  }),
  audioUrl: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid audio URL",
  }),
  thumbnail: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid thumbnail URL",
  }),
  passage: Joi.string().max(100).optional().allow("").messages({
    "string.max": "Scripture passage cannot exceed 100 characters",
  }),
  seriesId: Joi.string().optional().allow(""),
  status: Joi.string()
    .valid(...Object.values(ContentStatus))
    .default("PUBLISHED")
    .messages({
      "any.only": "Please select a valid status",
    }),
  isFeatured: Joi.boolean().default(false),
  order: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Order must be a number",
    "number.integer": "Order must be an integer",
    "number.min": "Order must be 0 or greater",
  }),
  metaDescription: Joi.string().max(160).optional().allow("").messages({
    "string.max": "Meta description cannot exceed 160 characters",
  }),
});

export const sermonSeriesCreateSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot exceed 200 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().max(2000).optional().allow("").messages({
    "string.max": "Description cannot exceed 2000 characters",
  }),
  image: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid image URL",
  }),
  isActive: Joi.boolean().default(true),
  order: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Order must be a number",
    "number.integer": "Order must be an integer",
    "number.min": "Order must be 0 or greater",
  }),
  startDate: Joi.date().optional().allow(null),
  endDate: Joi.date().optional().allow(null),
  metaDescription: Joi.string().max(160).optional().allow("").messages({
    "string.max": "Meta description cannot exceed 160 characters",
  }),
});

// Service validation schemas
export const serviceCreateSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.min": "Service name must be at least 3 characters long",
    "string.max": "Service name cannot exceed 100 characters",
    "any.required": "Service name is required",
  }),
  description: Joi.string().min(10).max(1000).required().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 1000 characters",
    "any.required": "Description is required",
  }),
  icon: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid icon URL",
  }),
  type: Joi.string()
    .valid(...Object.values(ServiceType))
    .required()
    .messages({
      "any.only": "Please select a valid service type",
      "any.required": "Service type is required",
    }),
  isActive: Joi.boolean().default(true),
  order: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Order must be a number",
    "number.integer": "Order must be an integer",
    "number.min": "Order must be 0 or greater",
  }),
  dayOfWeek: Joi.string().max(20).optional().allow("").messages({
    "string.max": "Day of week cannot exceed 20 characters",
  }),
  startTime: Joi.string().max(20).optional().allow("").messages({
    "string.max": "Start time cannot exceed 20 characters",
  }),
  endTime: Joi.string().max(20).optional().allow("").messages({
    "string.max": "End time cannot exceed 20 characters",
  }),
  zoomLink: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid Zoom URL",
  }),
  meetingId: Joi.string().max(50).optional().allow("").messages({
    "string.max": "Meeting ID cannot exceed 50 characters",
  }),
  passcode: Joi.string().max(20).optional().allow("").messages({
    "string.max": "Passcode cannot exceed 20 characters",
  }),
});

// About section validation schemas
export const aboutSectionCreateSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Title is required",
  }),
  content: Joi.string().min(10).required().messages({
    "string.min": "Content must be at least 10 characters long",
    "any.required": "Content is required",
  }),
  status: Joi.string()
    .valid(...Object.values(ContentStatus))
    .default("PUBLISHED")
    .messages({
      "any.only": "Please select a valid status",
    }),
  order: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Order must be a number",
    "number.integer": "Order must be an integer",
    "number.min": "Order must be 0 or greater",
  }),
  metaDescription: Joi.string().max(160).optional().allow("").messages({
    "string.max": "Meta description cannot exceed 160 characters",
  }),
});

// Contact info validation schemas
export const contactInfoUpdateSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  address: Joi.string().max(500).optional().messages({
    "string.max": "Address cannot exceed 500 characters",
  }),
  mapUrl: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid map URL",
  }),
  sundayHours: Joi.string().max(100).optional().allow("").messages({
    "string.max": "Sunday hours cannot exceed 100 characters",
  }),
  wednesdayHours: Joi.string().max(100).optional().allow("").messages({
    "string.max": "Wednesday hours cannot exceed 100 characters",
  }),
  otherHours: Joi.string().max(200).optional().allow("").messages({
    "string.max": "Other hours cannot exceed 200 characters",
  }),
  website: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid website URL",
  }),
  facebook: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid Facebook URL",
  }),
  instagram: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Please provide a valid Instagram URL",
  }),
  additionalInfo: Joi.string().max(1000).optional().allow("").messages({
    "string.max": "Additional info cannot exceed 1000 characters",
  }),
});

// Pagination validation schema
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be 1 or greater",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be 1 or greater",
    "number.max": "Limit cannot exceed 100",
  }),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "any.only": 'Sort order must be either "asc" or "desc"',
  }),
});

// ============================================================================
// VALIDATION MIDDLEWARE
// ============================================================================

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors: Record<string, string[]> = {};

      error.details.forEach((detail) => {
        const field = detail.path.join(".");
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(detail.message);
      });

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors: Record<string, string[]> = {};

      error.details.forEach((detail) => {
        const field = detail.path.join(".");
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(detail.message);
      });

      res.status(400).json({
        success: false,
        message: "Query validation failed",
        errors,
      });
    }

    req.query = value;
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors: Record<string, string[]> = {};

      error.details.forEach((detail) => {
        const field = detail.path.join(".");
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(detail.message);
      });

      res.status(400).json({
        success: false,
        message: "Parameter validation failed",
        errors,
      });
    }

    req.params = value;
    next();
  };
};

// ============================================================================
// CUSTOM VALIDATORS
// ============================================================================

export const validateObjectId = (value: string, helpers: any) => {
  if (!/^[0-9a-fA-F]{24}$/.test(value) && !/^[a-zA-Z0-9_-]{20,}$/.test(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const validateSlug = (value: string, helpers: any) => {
  if (!/^[a-z0-9-]+$/.test(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const validateYouTubeUrl = (value: string, helpers: any) => {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
  if (!youtubeRegex.test(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};
