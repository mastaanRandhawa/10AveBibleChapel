// Register module aliases for runtime
import "module-alias/register";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";

import { config } from "@/config";
import { logger, morganStream } from "@/config/logger";
import { prisma } from "@/config/database";
import { swaggerSpec } from "@/config/swagger";

// Middleware
import {
  globalErrorHandler,
  notFoundHandler,
  handleUnhandledRejection,
  handleUncaughtException,
  handleGracefulShutdown,
  securityHeaders,
  requestLogger,
} from "@/middleware/error.middleware";
import { generalRateLimit } from "@/middleware/rateLimit.middleware";

// Routes
import authRoutes from "@/routes/auth.routes";
import userRoutes from "@/routes/user.routes";
import prayerRoutes from "@/routes/prayer.routes";
import sermonRoutes from "@/routes/sermon.routes";
import contentRoutes from "@/routes/content.routes";
import mediaRoutes from "@/routes/media.routes";
import adminRoutes from "@/routes/admin.routes";

// ============================================================================
// CREATE EXPRESS APP
// ============================================================================

const app = express();

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

// Trust proxy (for rate limiting and IP detection)
app.set("trust proxy", 1);

// Security headers
app.use(securityHeaders);

// Helmet for additional security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ============================================================================
// CORS CONFIGURATION
// ============================================================================

app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: config.cors.methods,
    allowedHeaders: config.cors.allowedHeaders,
  })
);

// ============================================================================
// BODY PARSING MIDDLEWARE
// ============================================================================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================================================
// COMPRESSION
// ============================================================================

app.use(compression());

// ============================================================================
// LOGGING
// ============================================================================

app.use(morgan("combined", { stream: morganStream }));
app.use(requestLogger);

// ============================================================================
// RATE LIMITING
// ============================================================================

app.use(generalRateLimit);

// ============================================================================
// STATIC FILES
// ============================================================================

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), config.upload.dir))
);

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: process.env.npm_package_version || "1.0.0",
    });
  } catch (error) {
    logger.error("Health check failed:", error);
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Database connection failed",
    });
  }
});

// ============================================================================
// API ROUTES
// ============================================================================

// API version prefix
const API_PREFIX = "/api/v1";

// Authentication routes
app.use(`${API_PREFIX}/auth`, authRoutes);

// User routes
app.use(`${API_PREFIX}/users`, userRoutes);

// Prayer request routes
app.use(`${API_PREFIX}/prayer-requests`, prayerRoutes);

// Sermon routes
app.use(`${API_PREFIX}/sermons`, sermonRoutes);

// Content routes (services, ministries, about sections, contact info)
app.use(`${API_PREFIX}/content`, contentRoutes);

// Media routes
app.use(`${API_PREFIX}/media`, mediaRoutes);

// Admin routes
app.use(`${API_PREFIX}/admin`, adminRoutes);

// ============================================================================
// API DOCUMENTATION
// ============================================================================

// Swagger UI
app.use(
  `${API_PREFIX}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "10th Avenue Bible Chapel API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  })
);

// API info endpoint
app.get(`${API_PREFIX}/docs/info`, (req, res) => {
  res.json({
    name: "10th Avenue Bible Chapel API",
    version: "1.0.0",
    description: "Backend API for the 10th Avenue Bible Chapel website",
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      users: `${API_PREFIX}/users`,
      prayerRequests: `${API_PREFIX}/prayer-requests`,
      sermons: `${API_PREFIX}/sermons`,
      content: `${API_PREFIX}/content`,
      media: `${API_PREFIX}/media`,
      admin: `${API_PREFIX}/admin`,
    },
    documentation: `${API_PREFIX}/docs`,
    swagger: `${API_PREFIX}/docs`,
  });
});

// ============================================================================
// ROOT ROUTE
// ============================================================================

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to 10th Avenue Bible Chapel API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    documentation: `${API_PREFIX}/docs`,
    swagger: `${API_PREFIX}/docs`,
    health: "/health",
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// ============================================================================
// START SERVER
// ============================================================================

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(
    `📚 API Documentation: http://localhost:${PORT}${API_PREFIX}/docs`
  );
  logger.info(`📖 Swagger UI: http://localhost:${PORT}${API_PREFIX}/docs`);
  logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

handleUnhandledRejection();
handleUncaughtException();
handleGracefulShutdown(server);

// ============================================================================
// EXPORT FOR TESTING
// ============================================================================

export default app;
