import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { PrismaClient } from "@prisma/client";
import { buildOpenApiSpec } from "./swagger/openapiSpec";

// Import routes
import authRoutes from "./routes/auth";
import calendarRoutes from "./routes/calendar";
import announcementRoutes from "./routes/announcements";
import prayerRequestRoutes from "./routes/prayerRequests";
import sermonRoutes from "./routes/sermons";
import userRoutes from "./routes/users";
import contactRoutes from "./routes/contact";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/prayer-requests", prayerRequestRoutes);
app.use("/api/sermons", sermonRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

// Swagger UI (OpenAPI)
const openApiSpec = buildOpenApiSpec();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec, { explorer: true }));
app.get("/api-docs.json", (_req, res) => res.json(openApiSpec));

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Something went wrong!",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
