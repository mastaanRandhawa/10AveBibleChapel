import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./index";
import { additionalSwaggerDocs } from "../docs/swagger-routes";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "10th Avenue Bible Chapel API",
      version: "1.0.0",
      description: "RESTful API for 10th Avenue Bible Chapel website",
      contact: {
        name: "10th Avenue Bible Chapel",
        email: "info@10thavebiblechapel.org",
        url: "https://10thavebiblechapel.org",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: "Development server",
      },
      {
        url: "https://api.10thavebiblechapel.org/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token obtained from login endpoint",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            code: {
              type: "string",
              example: "VALIDATION_ERROR",
            },
            details: {
              type: "object",
              description: "Additional error details",
            },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              minimum: 1,
              example: 1,
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              example: 10,
            },
            total: {
              type: "integer",
              example: 50,
            },
            totalPages: {
              type: "integer",
              example: 5,
            },
            hasNext: {
              type: "boolean",
              example: true,
            },
            hasPrev: {
              type: "boolean",
              example: false,
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            role: {
              type: "string",
              enum: ["admin", "member", "guest"],
              example: "member",
            },
            phone: {
              type: "string",
              example: "+1234567890",
            },
            address: {
              type: "string",
              example: "123 Main St, City, State 12345",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              example: "1990-01-01",
            },
            memberSince: {
              type: "string",
              format: "date",
              example: "2020-01-01",
            },
            lastLoginAt: {
              type: "string",
              format: "date-time",
              example: "2023-12-01T10:00:00Z",
            },
            isEmailVerified: {
              type: "boolean",
              example: true,
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-12-01T10:00:00Z",
            },
          },
        },
        PrayerRequest: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            title: {
              type: "string",
              example: "Prayer for healing",
            },
            description: {
              type: "string",
              example: "Please pray for my recovery from illness",
            },
            requester: {
              type: "string",
              example: "John Doe",
            },
            category: {
              type: "string",
              enum: ["health", "family", "work", "spiritual", "other"],
              example: "health",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              example: "medium",
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected", "answered"],
              example: "approved",
            },
            isPrivate: {
              type: "boolean",
              example: false,
            },
            isAnswered: {
              type: "boolean",
              example: false,
            },
            answeredAt: {
              type: "string",
              format: "date-time",
              example: "2023-12-01T10:00:00Z",
            },
            answerNotes: {
              type: "string",
              example: "Prayer has been answered",
            },
            userId: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-12-01T10:00:00Z",
            },
          },
        },
        Sermon: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            title: {
              type: "string",
              example: "The Love of God",
            },
            slug: {
              type: "string",
              example: "the-love-of-god",
            },
            subtitle: {
              type: "string",
              example: "Understanding God's unconditional love",
            },
            description: {
              type: "string",
              example:
                "A sermon exploring the depth of God's love for humanity",
            },
            speaker: {
              type: "string",
              example: "Pastor John Smith",
            },
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
            passage: {
              type: "string",
              example: "John 3:16",
            },
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
            isFeatured: {
              type: "boolean",
              example: true,
            },
            order: {
              type: "integer",
              example: 1,
            },
            metaDescription: {
              type: "string",
              example: "A powerful message about God's love",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-12-01T10:00:00Z",
            },
          },
        },
        SermonSeries: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            title: {
              type: "string",
              example: "The Gospel of John",
            },
            slug: {
              type: "string",
              example: "the-gospel-of-john",
            },
            description: {
              type: "string",
              example: "A comprehensive study of the Gospel of John",
            },
            image: {
              type: "string",
              format: "uri",
              example: "https://example.com/images/john-series.jpg",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            order: {
              type: "integer",
              example: 1,
            },
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
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-12-01T10:00:00Z",
            },
          },
        },
        Service: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            name: {
              type: "string",
              example: "Breaking of Bread",
            },
            description: {
              type: "string",
              example: "Weekly communion service",
            },
            icon: {
              type: "string",
              example: "bread",
            },
            type: {
              type: "string",
              enum: ["weekly", "special", "online"],
              example: "weekly",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            order: {
              type: "integer",
              example: 1,
            },
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
            endTime: {
              type: "string",
              format: "time",
              example: "11:30",
            },
            zoomLink: {
              type: "string",
              format: "uri",
              example: "https://zoom.us/j/123456789",
            },
            meetingId: {
              type: "string",
              example: "123 456 7890",
            },
            passcode: {
              type: "string",
              example: "123456",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-12-01T10:00:00Z",
            },
          },
        },
        Ministry: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            name: {
              type: "string",
              example: "Children's Ministry",
            },
            description: {
              type: "string",
              example: "Ministry for children ages 5-12",
            },
            icon: {
              type: "string",
              example: "children",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            order: {
              type: "integer",
              example: 1,
            },
            schedule: {
              type: "string",
              example: "Sundays 9:00 AM - 10:30 AM",
            },
            location: {
              type: "string",
              example: "Main Hall",
            },
            ageRange: {
              type: "string",
              example: "5-12 years",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-12-01T10:00:00Z",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization",
      },
      {
        name: "Users",
        description: "User management (Admin only)",
      },
      {
        name: "Prayer Requests",
        description: "Prayer request management",
      },
      {
        name: "Sermons",
        description: "Sermon and sermon series management",
      },
      {
        name: "Content",
        description: "Services, ministries, and about sections",
      },
      {
        name: "Media",
        description: "File upload and media management",
      },
      {
        name: "Admin",
        description: "Administrative operations",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

// Merge additional documentation
const swaggerSpec = swaggerJsdoc(options) as any;

// Add additional paths and components
Object.assign(swaggerSpec.paths, additionalSwaggerDocs.paths);
Object.assign(swaggerSpec.components, additionalSwaggerDocs.components);

export { swaggerSpec };
