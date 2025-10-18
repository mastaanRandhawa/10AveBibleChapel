import { Request, Response, NextFunction } from "express";
import { validate, validateQuery, validateParams } from "@/utils/validation";
import {
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  prayerRequestCreateSchema,
  prayerRequestUpdateSchema,
  sermonCreateSchema,
  sermonSeriesCreateSchema,
  serviceCreateSchema,
  aboutSectionCreateSchema,
  contactInfoUpdateSchema,
  paginationSchema,
} from "@/utils/validation";

// ============================================================================
// USER VALIDATION MIDDLEWARE
// ============================================================================

export const validateUserRegistration = validate(userRegistrationSchema);
export const validateUserLogin = validate(userLoginSchema);
export const validateUserUpdate = validate(userUpdateSchema);

// ============================================================================
// PRAYER REQUEST VALIDATION MIDDLEWARE
// ============================================================================

export const validatePrayerRequestCreate = validate(prayerRequestCreateSchema);
export const validatePrayerRequestUpdate = validate(prayerRequestUpdateSchema);

// ============================================================================
// SERMON VALIDATION MIDDLEWARE
// ============================================================================

export const validateSermonCreate = validate(sermonCreateSchema);
export const validateSermonSeriesCreate = validate(sermonSeriesCreateSchema);

// ============================================================================
// SERVICE VALIDATION MIDDLEWARE
// ============================================================================

export const validateServiceCreate = validate(serviceCreateSchema);

// ============================================================================
// CONTENT VALIDATION MIDDLEWARE
// ============================================================================

export const validateAboutSectionCreate = validate(aboutSectionCreateSchema);
export const validateContactInfoUpdate = validate(contactInfoUpdateSchema);

// ============================================================================
// QUERY VALIDATION MIDDLEWARE
// ============================================================================

export const validatePagination = validateQuery(paginationSchema);

// ============================================================================
// PARAMETER VALIDATION MIDDLEWARE
// ============================================================================

import Joi from "joi";

const idParamSchema = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "ID parameter is required",
    "string.empty": "ID parameter cannot be empty",
  }),
});

const slugParamSchema = Joi.object({
  slug: Joi.string().required().messages({
    "any.required": "Slug parameter is required",
    "string.empty": "Slug parameter cannot be empty",
  }),
});

export const validateIdParam = validateParams(idParamSchema);
export const validateSlugParam = validateParams(slugParamSchema);

// ============================================================================
// CUSTOM VALIDATION MIDDLEWARE
// ============================================================================

export const validatePasswordReset = validate(
  Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  })
);

export const validatePasswordResetConfirm = validate(
  Joi.object({
    token: Joi.string().required().messages({
      "any.required": "Reset token is required",
      "string.empty": "Reset token cannot be empty",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
    }),
  })
);

export const validateEmailVerification = validate(
  Joi.object({
    token: Joi.string().required().messages({
      "any.required": "Verification token is required",
      "string.empty": "Verification token cannot be empty",
    }),
  })
);

export const validatePasswordChange = validate(
  Joi.object({
    currentPassword: Joi.string().required().messages({
      "any.required": "Current password is required",
    }),
    newPassword: Joi.string().min(8).required().messages({
      "string.min": "New password must be at least 8 characters long",
      "any.required": "New password is required",
    }),
  })
);

// ============================================================================
// FILE UPLOAD VALIDATION
// ============================================================================

export const validateFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.file && !req.files) {
    res.status(400).json({
      success: false,
      message: "No file uploaded",
      code: "FILE_ERROR",
    });
  }

  // Check file size
  const maxSize = 10 * 1024 * 1024; // 10MB
  const files = req.files
    ? Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat()
    : [req.file];

  for (const file of files) {
    if (file && file.size > maxSize) {
      res.status(413).json({
        success: false,
        message: "File size exceeds maximum allowed size (10MB)",
        code: "FILE_ERROR",
      });
    }
  }

  next();
};

// ============================================================================
// SEARCH QUERY VALIDATION
// ============================================================================

const searchQuerySchema = Joi.object({
  q: Joi.string().min(1).max(100).optional().messages({
    "string.min": "Search query must be at least 1 character long",
    "string.max": "Search query cannot exceed 100 characters",
  }),
  category: Joi.string().optional(),
  status: Joi.string().optional(),
  dateFrom: Joi.date().optional().messages({
    "date.base": "Invalid date format for dateFrom",
  }),
  dateTo: Joi.date().optional().messages({
    "date.base": "Invalid date format for dateTo",
  }),
  speaker: Joi.string().optional(),
  series: Joi.string().optional(),
});

export const validateSearchQuery = validateQuery(searchQuerySchema);

// ============================================================================
// PRAYER REQUEST FILTER VALIDATION
// ============================================================================

const prayerRequestFilterSchema = Joi.object({
  status: Joi.array()
    .items(Joi.string().valid("PENDING", "APPROVED", "REJECTED", "ANSWERED"))
    .optional(),
  category: Joi.array()
    .items(
      Joi.string().valid(
        "HEALTH",
        "FAMILY",
        "WORK",
        "SPIRITUAL",
        "COMMUNITY",
        "OTHER"
      )
    )
    .optional(),
  priority: Joi.array()
    .items(Joi.string().valid("URGENT", "HIGH", "NORMAL"))
    .optional(),
  isPrivate: Joi.boolean().optional(),
  isAnswered: Joi.boolean().optional(),
  userId: Joi.string().optional(),
  dateFrom: Joi.date().optional().messages({
    "date.base": "Invalid date format for dateFrom",
  }),
  dateTo: Joi.date().optional().messages({
    "date.base": "Invalid date format for dateTo",
  }),
});

export const validatePrayerRequestFilters = validateQuery(
  prayerRequestFilterSchema
);

// ============================================================================
// SERMON FILTER VALIDATION
// ============================================================================

const sermonFilterSchema = Joi.object({
  status: Joi.array()
    .items(Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED"))
    .optional(),
  isFeatured: Joi.boolean().optional(),
  seriesId: Joi.string().optional(),
  speaker: Joi.string().optional(),
  dateFrom: Joi.date().optional().messages({
    "date.base": "Invalid date format for dateFrom",
  }),
  dateTo: Joi.date().optional().messages({
    "date.base": "Invalid date format for dateTo",
  }),
});

export const validateSermonFilters = validateQuery(sermonFilterSchema);

// ============================================================================
// BULK OPERATION VALIDATION
// ============================================================================

const bulkOperationSchema = Joi.object({
  ids: Joi.array().items(Joi.string()).min(1).max(100).required().messages({
    "array.min": "At least one ID is required",
    "array.max": "Maximum 100 IDs allowed",
    "any.required": "IDs array is required",
  }),
  action: Joi.string()
    .valid("delete", "update", "activate", "deactivate")
    .required()
    .messages({
      "any.only": "Action must be one of: delete, update, activate, deactivate",
      "any.required": "Action is required",
    }),
  data: Joi.object().optional(),
});

export const validateBulkOperation = validate(bulkOperationSchema);

// ============================================================================
// SORT VALIDATION
// ============================================================================

const sortSchema = Joi.object({
  sortBy: Joi.string()
    .valid("createdAt", "updatedAt", "name", "title", "date", "priority")
    .optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "any.only": 'Sort order must be either "asc" or "desc"',
  }),
});

export const validateSort = validateQuery(sortSchema);

// ============================================================================
// CUSTOM VALIDATION HELPERS
// ============================================================================

export const validateObjectId = (value: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(value) || /^[a-zA-Z0-9_-]{20,}$/.test(value);
};

export const validateSlug = (value: string): boolean => {
  return /^[a-z0-9-]+$/.test(value);
};

export const validateYouTubeUrl = (value: string): boolean => {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
  return youtubeRegex.test(value);
};

// ============================================================================
// CONDITIONAL VALIDATION
// ============================================================================

export const validateConditional = (
  condition: (req: Request) => boolean,
  schema: Joi.ObjectSchema
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (condition(req)) {
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
    }

    next();
  };
};

// ============================================================================
// SANITIZATION MIDDLEWARE
// ============================================================================

export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const sanitizeString = (str: string): string => {
    return str
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, ""); // Remove event handlers
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === "string") {
      return sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};
