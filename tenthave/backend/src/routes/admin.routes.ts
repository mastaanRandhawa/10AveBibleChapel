import { Router, Request, Response } from "express";
import { authenticate, requireAdmin } from "@/middleware/auth.middleware";
import { asyncHandler } from "@/middleware/error.middleware";
import { authService } from "@/services/auth.service";
import { prayerService } from "@/services/prayer.service";
import { sermonService } from "@/services/sermon.service";
import { contentService } from "@/services/content.service";
import { mediaService } from "@/services/media.service";

const router = Router();

// ============================================================================
// ADMIN DASHBOARD STATISTICS
// ============================================================================

// Get dashboard statistics
router.get(
  "/dashboard",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const [prayerStats, sermonStats, contentStats, mediaStats, userStats] =
      await Promise.all([
        prayerService.getPrayerStatistics(),
        sermonService.getSermonStatistics(),
        contentService.getContentStatistics(),
        mediaService.getFileStatistics(),
        authService.getAllUsers(1, 1), // Just get count
      ]);

    const dashboardStats = {
      prayers: prayerStats,
      sermons: sermonStats,
      content: contentStats,
      media: mediaStats,
      users: {
        total: userStats.pagination.total,
      },
    };

    res.status(200).json({
      success: true,
      data: dashboardStats,
    });
  })
);

// ============================================================================
// SYSTEM HEALTH CHECK
// ============================================================================

// Get system health
router.get(
  "/health",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { prisma } = await import("@/config/database");

    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;

      // Check disk space (basic check)
      const fs = await import("fs/promises");
      const stats = await fs.statfs(process.cwd());
      const freeSpace = stats.bavail * stats.bsize;
      const totalSpace = stats.blocks * stats.bsize;
      const usedSpace = totalSpace - freeSpace;

      const health = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
        diskSpace: {
          total: totalSpace,
          used: usedSpace,
          free: freeSpace,
          usagePercent: Math.round((usedSpace / totalSpace) * 100),
        },
        memory: {
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal,
          external: process.memoryUsage().external,
        },
        uptime: process.uptime(),
      };

      res.status(200).json({
        success: true,
        data: health,
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        message: "System health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  })
);

// ============================================================================
// SYSTEM MAINTENANCE
// ============================================================================

// Cleanup system
router.post(
  "/maintenance/cleanup",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { cleanupType } = req.body;

    let result: any = {};

    switch (cleanupType) {
      case "orphaned-files":
        result = await mediaService.cleanupOrphanedFiles();
        break;
      case "old-files":
        const { daysOld = 30 } = req.body;
        result = await mediaService.cleanupOldFiles(daysOld);
        break;
      case "all":
        const [orphanedResult, oldResult] = await Promise.all([
          mediaService.cleanupOrphanedFiles(),
          mediaService.cleanupOldFiles(30),
        ]);
        result = {
          orphanedFiles: orphanedResult,
          oldFiles: oldResult,
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid cleanup type",
        });
    }

    return res.status(200).json({
      success: true,
      message: "Cleanup completed successfully",
      data: result,
    });
  })
);

// ============================================================================
// BACKUP AND EXPORT
// ============================================================================

// Export data
router.get(
  "/export/:type",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.params;
    const { format = "json" } = req.query;

    // This is a basic implementation - in production, you'd want more robust export functionality
    const { prisma } = await import("@/config/database");

    let data: any = {};

    switch (type) {
      case "prayers":
        data = await prisma.prayerRequest.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
        break;
      case "sermons":
        data = await prisma.sermon.findMany({
          include: {
            series: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        break;
      case "users":
        data = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            lastLoginAt: true,
          },
        });
        break;
      case "all":
        data = {
          prayers: await prisma.prayerRequest.findMany(),
          sermons: await prisma.sermon.findMany(),
          users: await prisma.user.findMany({
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
            },
          }),
          services: await prisma.service.findMany(),
          ministries: await prisma.ministry.findMany(),
          aboutSections: await prisma.aboutSection.findMany(),
          contactInfo: await prisma.contactInfo.findMany(),
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid export type",
        });
    }

    if (format === "csv") {
      // Basic CSV export - you'd want a proper CSV library for production
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${type}-export.csv"`
      );
      res.send(JSON.stringify(data));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${type}-export.json"`
      );
      return res.json({
        success: true,
        data,
        exportedAt: new Date().toISOString(),
        type,
      });
    }

    return res.status(200).json({
      success: true,
      data,
      exportedAt: new Date().toISOString(),
      type,
    });
  })
);

// ============================================================================
// SYSTEM CONFIGURATION
// ============================================================================

// Get system configuration
router.get(
  "/config",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { prisma } = await import("@/config/database");

    const config = await prisma.siteConfig.findMany();

    const configObject = config.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);

    res.status(200).json({
      success: true,
      data: configObject,
    });
  })
);

// Update system configuration
router.put(
  "/config",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { prisma } = await import("@/config/database");
    const configData = req.body;

    const updates = Object.entries(configData).map(([key, value]) =>
      prisma.siteConfig.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      })
    );

    await Promise.all(updates);

    res.status(200).json({
      success: true,
      message: "Configuration updated successfully",
    });
  })
);

// ============================================================================
// AUDIT LOGS
// ============================================================================

// Get audit logs
router.get(
  "/audit-logs",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { prisma } = await import("@/config/database");
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.contentEdit.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.contentEdit.count(),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  })
);

export default router;
