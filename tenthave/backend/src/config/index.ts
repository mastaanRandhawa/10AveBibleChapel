import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env") });

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "PORT", "NODE_ENV"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Database configuration
  database: {
    url: process.env.DATABASE_URL!,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },

  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
    from: process.env.EMAIL_FROM || "noreply@10thavebiblechapel.com",
  },

  // File upload configuration
  upload: {
    dir: process.env.UPLOAD_DIR || "./uploads",
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), // 10MB
    allowedImageTypes: (
      process.env.ALLOWED_IMAGE_TYPES ||
      "image/jpeg,image/png,image/webp,image/gif"
    ).split(","),
    allowedDocumentTypes: (
      process.env.ALLOWED_DOCUMENT_TYPES ||
      "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ).split(","),
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  },

  // Security configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
    sessionSecret: process.env.SESSION_SECRET || "your-session-secret-here",
  },

  // External services
  external: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    youtubeApiKey: process.env.YOUTUBE_API_KEY || "",
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "./logs/app.log",
  },
};

export default config;
