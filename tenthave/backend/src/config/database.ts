import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

// Global variable to store the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma client instance
const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "event",
        level: "error",
      },
      {
        emit: "event",
        level: "info",
      },
      {
        emit: "event",
        level: "warn",
      },
    ],
    errorFormat: "pretty",
  });
};

// Use global variable in development to prevent multiple instances
// In production, create a new instance each time
export const prisma = globalThis.__prisma || createPrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.__prisma = prisma;
}

// Set up event listeners for logging
(prisma as any).$on("query", (e: any) => {
  if (process.env.NODE_ENV === "development") {
    logger.debug("Query: " + e.query);
    logger.debug("Params: " + e.params);
    logger.debug("Duration: " + e.duration + "ms");
  }
});

(prisma as any).$on("error", (e: any) => {
  logger.error("Database error: " + e.message);
});

(prisma as any).$on("info", (e: any) => {
  logger.info("Database info: " + e.message);
});

(prisma as any).$on("warn", (e: any) => {
  logger.warn("Database warning: " + e.message);
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
