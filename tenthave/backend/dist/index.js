"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const client_1 = require("@prisma/client");
const openapiSpec_1 = require("./swagger/openapiSpec");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const calendar_1 = __importDefault(require("./routes/calendar"));
const announcements_1 = __importDefault(require("./routes/announcements"));
const prayerRequests_1 = __importDefault(require("./routes/prayerRequests"));
const sermons_1 = __importDefault(require("./routes/sermons"));
const users_1 = __importDefault(require("./routes/users"));
const contact_1 = __importDefault(require("./routes/contact"));
const voiceRecordings_1 = __importDefault(require("./routes/voiceRecordings"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Initialize Prisma Client
exports.prisma = new client_1.PrismaClient();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});
// API Routes
app.use("/api/auth", auth_1.default);
app.use("/api/calendar", calendar_1.default);
app.use("/api/announcements", announcements_1.default);
app.use("/api/prayer-requests", prayerRequests_1.default);
app.use("/api/sermons", sermons_1.default);
app.use("/api/users", users_1.default);
app.use("/api/contact", contact_1.default);
app.use("/api/voice-recordings", voiceRecordings_1.default);
// Swagger UI (OpenAPI)
const openApiSpec = (0, openapiSpec_1.buildOpenApiSpec)();
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openApiSpec, { explorer: true }));
app.get("/api-docs.json", (_req, res) => res.json(openApiSpec));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Something went wrong!",
        message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});
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
    await exports.prisma.$disconnect();
});
//# sourceMappingURL=index.js.map