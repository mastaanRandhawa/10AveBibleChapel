/**
 * Additional Swagger documentation for remaining routes
 * This file contains comprehensive API documentation for all endpoints
 */

export const additionalSwaggerDocs = {
  paths: {
    // ============================================================================
    // USER ROUTES (Admin only)
    // ============================================================================
    "/api/v1/users": {
      get: {
        summary: "Get all users (Admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
            description: "Number of items per page",
          },
          {
            in: "query",
            name: "role",
            schema: { type: "string", enum: ["admin", "member", "guest"] },
            description: "Filter by user role",
          },
          {
            in: "query",
            name: "isActive",
            schema: { type: "boolean" },
            description: "Filter by active status",
          },
          {
            in: "query",
            name: "search",
            schema: { type: "string" },
            description: "Search by name or email",
          },
        ],
        responses: {
          200: {
            description: "Users retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
        },
      },
    },
    "/api/v1/users/{id}": {
      get: {
        summary: "Get user by ID (Admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "User ID",
          },
        ],
        responses: {
          200: {
            description: "User retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
      put: {
        summary: "Update user role (Admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "User ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["role"],
                properties: {
                  role: {
                    type: "string",
                    enum: ["admin", "member", "guest"],
                    example: "member",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "User role updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "User role updated successfully",
                    },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
      delete: {
        summary: "Deactivate user (Admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "User ID",
          },
        ],
        responses: {
          200: {
            description: "User deactivated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "User deactivated successfully",
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
    },

    // ============================================================================
    // SERMON ROUTES
    // ============================================================================
    "/api/v1/sermons": {
      get: {
        summary: "Get sermons",
        tags: ["Sermons"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
            description: "Number of items per page",
          },
          {
            in: "query",
            name: "status",
            schema: {
              type: "string",
              enum: ["draft", "published", "archived"],
            },
            description: "Filter by status",
          },
          {
            in: "query",
            name: "speaker",
            schema: { type: "string" },
            description: "Filter by speaker",
          },
          {
            in: "query",
            name: "seriesId",
            schema: { type: "string", format: "uuid" },
            description: "Filter by sermon series ID",
          },
          {
            in: "query",
            name: "isFeatured",
            schema: { type: "boolean" },
            description: "Filter featured sermons",
          },
          {
            in: "query",
            name: "dateFrom",
            schema: { type: "string", format: "date" },
            description: "Filter from date",
          },
          {
            in: "query",
            name: "dateTo",
            schema: { type: "string", format: "date" },
            description: "Filter to date",
          },
        ],
        responses: {
          200: {
            description: "Sermons retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Sermon" },
                    },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
        },
      },
      post: {
        summary: "Create sermon (Admin only)",
        tags: ["Sermons"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "speaker", "date", "youtubeUrl"],
                properties: {
                  title: { type: "string", example: "The Love of God" },
                  subtitle: {
                    type: "string",
                    example: "Understanding God's unconditional love",
                  },
                  description: {
                    type: "string",
                    example: "A sermon exploring the depth of God's love",
                  },
                  speaker: { type: "string", example: "Pastor John Smith" },
                  date: {
                    type: "string",
                    format: "date",
                    example: "2023-12-01",
                  },
                  youtubeUrl: {
                    type: "string",
                    format: "uri",
                    example: "https://www.youtube.com/watch?v=example",
                  },
                  audioUrl: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com/audio/sermon.mp3",
                  },
                  thumbnail: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com/images/sermon-thumb.jpg",
                  },
                  passage: { type: "string", example: "John 3:16" },
                  seriesId: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174000",
                  },
                  status: {
                    type: "string",
                    enum: ["draft", "published", "archived"],
                    example: "published",
                  },
                  isFeatured: { type: "boolean", example: true },
                  order: { type: "integer", example: 1 },
                  metaDescription: {
                    type: "string",
                    example: "A powerful message about God's love",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Sermon created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Sermon created successfully",
                    },
                    data: { $ref: "#/components/schemas/Sermon" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
        },
      },
    },
    "/api/v1/sermons/{id}": {
      get: {
        summary: "Get sermon by ID",
        tags: ["Sermons"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Sermon ID",
          },
        ],
        responses: {
          200: {
            description: "Sermon retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Sermon" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
      put: {
        summary: "Update sermon (Admin only)",
        tags: ["Sermons"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Sermon ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Updated sermon title" },
                  subtitle: { type: "string", example: "Updated subtitle" },
                  description: {
                    type: "string",
                    example: "Updated description",
                  },
                  speaker: { type: "string", example: "Pastor John Smith" },
                  date: {
                    type: "string",
                    format: "date",
                    example: "2023-12-01",
                  },
                  youtubeUrl: {
                    type: "string",
                    format: "uri",
                    example: "https://www.youtube.com/watch?v=example",
                  },
                  audioUrl: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com/audio/sermon.mp3",
                  },
                  thumbnail: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com/images/sermon-thumb.jpg",
                  },
                  passage: { type: "string", example: "John 3:16" },
                  seriesId: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174000",
                  },
                  status: {
                    type: "string",
                    enum: ["draft", "published", "archived"],
                    example: "published",
                  },
                  isFeatured: { type: "boolean", example: true },
                  order: { type: "integer", example: 1 },
                  metaDescription: {
                    type: "string",
                    example: "A powerful message about God's love",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Sermon updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Sermon updated successfully",
                    },
                    data: { $ref: "#/components/schemas/Sermon" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
      delete: {
        summary: "Delete sermon (Admin only)",
        tags: ["Sermons"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Sermon ID",
          },
        ],
        responses: {
          200: {
            description: "Sermon deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Sermon deleted successfully",
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
          404: { $ref: "#/components/responses/NotFoundError" },
        },
      },
    },

    // ============================================================================
    // SERMON SERIES ROUTES
    // ============================================================================
    "/api/v1/sermons/series": {
      get: {
        summary: "Get sermon series",
        tags: ["Sermons"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
            description: "Number of items per page",
          },
          {
            in: "query",
            name: "isActive",
            schema: { type: "boolean" },
            description: "Filter by active status",
          },
        ],
        responses: {
          200: {
            description: "Sermon series retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SermonSeries" },
                    },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
        },
      },
      post: {
        summary: "Create sermon series (Admin only)",
        tags: ["Sermons"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "The Gospel of John" },
                  description: {
                    type: "string",
                    example: "A comprehensive study of the Gospel of John",
                  },
                  image: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com/images/john-series.jpg",
                  },
                  isActive: { type: "boolean", example: true },
                  order: { type: "integer", example: 1 },
                  startDate: {
                    type: "string",
                    format: "date",
                    example: "2023-01-01",
                  },
                  endDate: {
                    type: "string",
                    format: "date",
                    example: "2023-12-31",
                  },
                  metaDescription: {
                    type: "string",
                    example:
                      "Explore the Gospel of John in this comprehensive series",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Sermon series created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Sermon series created successfully",
                    },
                    data: { $ref: "#/components/schemas/SermonSeries" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
        },
      },
    },

    // ============================================================================
    // CONTENT ROUTES (Services, Ministries, About, Contact)
    // ============================================================================
    "/api/v1/content/services": {
      get: {
        summary: "Get services",
        tags: ["Content"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "isActive",
            schema: { type: "boolean" },
            description: "Filter by active status",
          },
          {
            in: "query",
            name: "type",
            schema: { type: "string", enum: ["weekly", "special", "online"] },
            description: "Filter by service type",
          },
        ],
        responses: {
          200: {
            description: "Services retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Service" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create service (Admin only)",
        tags: ["Content"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "type"],
                properties: {
                  name: { type: "string", example: "Breaking of Bread" },
                  description: {
                    type: "string",
                    example: "Weekly communion service",
                  },
                  icon: { type: "string", example: "bread" },
                  type: {
                    type: "string",
                    enum: ["weekly", "special", "online"],
                    example: "weekly",
                  },
                  isActive: { type: "boolean", example: true },
                  order: { type: "integer", example: 1 },
                  dayOfWeek: {
                    type: "string",
                    enum: [
                      "sunday",
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                    ],
                    example: "sunday",
                  },
                  startTime: {
                    type: "string",
                    format: "time",
                    example: "10:00",
                  },
                  endTime: { type: "string", format: "time", example: "11:30" },
                  zoomLink: {
                    type: "string",
                    format: "uri",
                    example: "https://zoom.us/j/123456789",
                  },
                  meetingId: { type: "string", example: "123 456 7890" },
                  passcode: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Service created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Service created successfully",
                    },
                    data: { $ref: "#/components/schemas/Service" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
        },
      },
    },

    // ============================================================================
    // MEDIA ROUTES
    // ============================================================================
    "/api/v1/media/upload": {
      post: {
        summary: "Upload single file",
        tags: ["Media"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "File to upload",
                  },
                  entityType: {
                    type: "string",
                    enum: [
                      "sermon",
                      "sermon-series",
                      "service",
                      "ministry",
                      "about",
                      "user",
                    ],
                    description: "Type of entity this file belongs to",
                  },
                  entityId: {
                    type: "string",
                    format: "uuid",
                    description: "ID of the entity this file belongs to",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "File uploaded successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "File uploaded successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string", format: "uuid" },
                        filename: { type: "string" },
                        originalName: { type: "string" },
                        mimeType: { type: "string" },
                        size: { type: "integer" },
                        url: { type: "string", format: "uri" },
                        entityType: { type: "string" },
                        entityId: { type: "string", format: "uuid" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          413: {
            description: "File too large",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ============================================================================
    // ADMIN ROUTES
    // ============================================================================
    "/api/v1/admin/dashboard": {
      get: {
        summary: "Get admin dashboard statistics",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dashboard statistics retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        users: {
                          type: "object",
                          properties: {
                            total: { type: "integer", example: 150 },
                            active: { type: "integer", example: 140 },
                            newThisMonth: { type: "integer", example: 5 },
                          },
                        },
                        prayerRequests: {
                          type: "object",
                          properties: {
                            total: { type: "integer", example: 75 },
                            pending: { type: "integer", example: 10 },
                            approved: { type: "integer", example: 60 },
                            answered: { type: "integer", example: 5 },
                          },
                        },
                        sermons: {
                          type: "object",
                          properties: {
                            total: { type: "integer", example: 200 },
                            published: { type: "integer", example: 180 },
                            featured: { type: "integer", example: 10 },
                          },
                        },
                        media: {
                          type: "object",
                          properties: {
                            totalFiles: { type: "integer", example: 500 },
                            totalSize: { type: "string", example: "2.5 GB" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/UnauthorizedError" },
          403: { $ref: "#/components/responses/ForbiddenError" },
        },
      },
    },
  },

  components: {
    responses: {
      ValidationError: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      UnauthorizedError: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      ForbiddenError: {
        description: "Forbidden",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      NotFoundError: {
        description: "Not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
    },
  },
};
