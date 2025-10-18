import { prisma } from "@/config/database";
import { logger } from "@/config/logger";
import {
  PrayerRequest,
  PrayerStatus,
  PrayerCategory,
  PrayerPriority,
  UserRole,
} from "@prisma/client";
import {
  PrayerRequestCreateData,
  PrayerRequestUpdateData,
  PrayerRequestWithUser,
  PrayerRequestFilters,
  PaginationQuery,
  PaginationMeta,
} from "@/types";
import { AppError, NotFoundError, AuthorizationError } from "@/utils/errors";
import { calculatePagination, getPaginationParams } from "@/utils/helpers";
import { emailService } from "./email.service";

export class PrayerService {
  // ============================================================================
  // CREATE PRAYER REQUEST
  // ============================================================================

  async createPrayerRequest(
    data: PrayerRequestCreateData,
    userId?: string
  ): Promise<PrayerRequest> {
    try {
      const prayerRequest = await prisma.prayerRequest.create({
        data: {
          title: data.title,
          description: data.description,
          requester: data.requester,
          category: data.category,
          priority: data.priority,
          isPrivate: data.isPrivate,
          userId: userId,
          status: PrayerStatus.PENDING, // Always start as pending
        },
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
      });

      // Send notification to admins for new prayer requests
      try {
        const admins = await prisma.user.findMany({
          where: { role: UserRole.ADMIN },
          select: { email: true, name: true },
        });

        for (const admin of admins) {
          await emailService.sendPrayerRequestNotification(
            admin.email,
            data.requester || "Anonymous",
            data.title
          );
        }
      } catch (emailError) {
        logger.warn("Failed to send prayer request notification:", emailError);
      }

      logger.info(`Prayer request created: ${prayerRequest.id}`);
      return prayerRequest as any;
    } catch (error) {
      logger.error("Create prayer request error:", error);
      throw error;
    }
  }

  // ============================================================================
  // GET PRAYER REQUESTS
  // ============================================================================

  async getPrayerRequests(
    filters: PrayerRequestFilters = {},
    pagination: PaginationQuery = {},
    currentUser?: { id: string; role: UserRole }
  ): Promise<{
    prayerRequests: PrayerRequestWithUser[];
    pagination: PaginationMeta;
  }> {
    try {
      const { page, limit, skip, sortBy, sortOrder } =
        getPaginationParams(pagination);

      // Build where clause based on filters and user permissions
      const where: any = {};

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        where.status = { in: filters.status };
      }

      if (filters.category && filters.category.length > 0) {
        where.category = { in: filters.category };
      }

      if (filters.priority && filters.priority.length > 0) {
        where.priority = { in: filters.priority };
      }

      if (filters.isPrivate !== undefined) {
        where.isPrivate = filters.isPrivate;
      }

      if (filters.isAnswered !== undefined) {
        where.isAnswered = filters.isAnswered;
      }

      if (filters.userId) {
        where.userId = filters.userId;
      }

      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
        if (filters.dateTo) where.createdAt.lte = filters.dateTo;
      }

      // Apply user permission filters
      if (currentUser) {
        if (currentUser.role === UserRole.ADMIN) {
          // Admins can see all prayer requests
        } else if (currentUser.role === UserRole.MEMBER) {
          // Members can see approved public requests and their own requests
          where.OR = [
            { status: PrayerStatus.APPROVED, isPrivate: false },
            { userId: currentUser.id },
            {
              permissions: {
                some: {
                  userId: currentUser.id,
                  canView: true,
                },
              },
            },
          ];
        } else {
          // Guests can only see approved public requests
          where.status = PrayerStatus.APPROVED;
          where.isPrivate = false;
        }
      } else {
        // No user - only show approved public requests
        where.status = PrayerStatus.APPROVED;
        where.isPrivate = false;
      }

      const [prayerRequests, total] = await Promise.all([
        prisma.prayerRequest.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            permissions: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        }),
        prisma.prayerRequest.count({ where }),
      ]);

      return {
        prayerRequests: prayerRequests as any,
        pagination: calculatePagination(page, limit, total),
      };
    } catch (error) {
      logger.error("Get prayer requests error:", error);
      throw error;
    }
  }

  // ============================================================================
  // GET PRAYER REQUEST BY ID
  // ============================================================================

  async getPrayerRequestById(
    id: string,
    currentUser?: { id: string; role: UserRole }
  ): Promise<PrayerRequestWithUser> {
    try {
      const prayerRequest = await prisma.prayerRequest.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          permissions: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!prayerRequest) {
        throw new NotFoundError("Prayer request");
      }

      // Check permissions
      if (currentUser) {
        if (currentUser.role === UserRole.ADMIN) {
          // Admins can see all prayer requests
        } else if (currentUser.role === UserRole.MEMBER) {
          // Members can see approved public requests, their own requests, or requests they have permission for
          const canView =
            (prayerRequest.status === PrayerStatus.APPROVED &&
              !prayerRequest.isPrivate) ||
            prayerRequest.userId === currentUser.id ||
            prayerRequest.permissions.some(
              (p) => p.userId === currentUser.id && p.canView
            );

          if (!canView) {
            throw new AuthorizationError(
              "You do not have permission to view this prayer request"
            );
          }
        } else {
          // Guests can only see approved public requests
          if (
            prayerRequest.status !== PrayerStatus.APPROVED ||
            prayerRequest.isPrivate
          ) {
            throw new AuthorizationError(
              "You do not have permission to view this prayer request"
            );
          }
        }
      } else {
        // No user - only show approved public requests
        if (
          prayerRequest.status !== PrayerStatus.APPROVED ||
          prayerRequest.isPrivate
        ) {
          throw new AuthorizationError(
            "You do not have permission to view this prayer request"
          );
        }
      }

      return prayerRequest as any;
    } catch (error) {
      logger.error("Get prayer request by ID error:", error);
      throw error;
    }
  }

  // ============================================================================
  // UPDATE PRAYER REQUEST
  // ============================================================================

  async updatePrayerRequest(
    id: string,
    data: PrayerRequestUpdateData,
    currentUser: { id: string; role: UserRole }
  ): Promise<PrayerRequest> {
    try {
      const existingRequest = await prisma.prayerRequest.findUnique({
        where: { id },
      });

      if (!existingRequest) {
        throw new NotFoundError("Prayer request");
      }

      // Check permissions
      if (
        currentUser.role !== UserRole.ADMIN &&
        existingRequest.userId !== currentUser.id
      ) {
        throw new AuthorizationError(
          "You can only update your own prayer requests"
        );
      }

      const prayerRequest = await prisma.prayerRequest.update({
        where: { id },
        data: {
          ...data,
          // Only admins can change status
          ...(currentUser.role === UserRole.ADMIN
            ? { status: data.status }
            : {}),
        },
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
      });

      logger.info(`Prayer request updated: ${id}`);
      return prayerRequest as any;
    } catch (error) {
      logger.error("Update prayer request error:", error);
      throw error;
    }
  }

  // ============================================================================
  // DELETE PRAYER REQUEST
  // ============================================================================

  async deletePrayerRequest(
    id: string,
    currentUser: { id: string; role: UserRole }
  ): Promise<void> {
    try {
      const existingRequest = await prisma.prayerRequest.findUnique({
        where: { id },
      });

      if (!existingRequest) {
        throw new NotFoundError("Prayer request");
      }

      // Check permissions
      if (
        currentUser.role !== UserRole.ADMIN &&
        existingRequest.userId !== currentUser.id
      ) {
        throw new AuthorizationError(
          "You can only delete your own prayer requests"
        );
      }

      await prisma.prayerRequest.delete({
        where: { id },
      });

      logger.info(`Prayer request deleted: ${id}`);
    } catch (error) {
      logger.error("Delete prayer request error:", error);
      throw error;
    }
  }

  // ============================================================================
  // APPROVE PRAYER REQUEST
  // ============================================================================

  async approvePrayerRequest(id: string): Promise<PrayerRequest> {
    try {
      const prayerRequest = await prisma.prayerRequest.update({
        where: { id },
        data: { status: PrayerStatus.APPROVED },
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
      });

      logger.info(`Prayer request approved: ${id}`);
      return prayerRequest as any;
    } catch (error) {
      logger.error("Approve prayer request error:", error);
      throw error;
    }
  }

  // ============================================================================
  // REJECT PRAYER REQUEST
  // ============================================================================

  async rejectPrayerRequest(id: string): Promise<PrayerRequest> {
    try {
      const prayerRequest = await prisma.prayerRequest.update({
        where: { id },
        data: { status: PrayerStatus.REJECTED },
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
      });

      logger.info(`Prayer request rejected: ${id}`);
      return prayerRequest as any;
    } catch (error) {
      logger.error("Reject prayer request error:", error);
      throw error;
    }
  }

  // ============================================================================
  // MARK PRAYER AS ANSWERED
  // ============================================================================

  async markPrayerAsAnswered(
    id: string,
    answerNotes?: string
  ): Promise<PrayerRequest> {
    try {
      const prayerRequest = await prisma.prayerRequest.update({
        where: { id },
        data: {
          isAnswered: true,
          answeredAt: new Date(),
          answerNotes: answerNotes,
        },
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
      });

      logger.info(`Prayer request marked as answered: ${id}`);
      return prayerRequest as any;
    } catch (error) {
      logger.error("Mark prayer as answered error:", error);
      throw error;
    }
  }

  // ============================================================================
  // MANAGE PRAYER PERMISSIONS
  // ============================================================================

  async grantPrayerPermission(
    prayerRequestId: string,
    userId: string
  ): Promise<void> {
    try {
      await prisma.prayerPermission.upsert({
        where: {
          prayerRequestId_userId: {
            prayerRequestId,
            userId,
          },
        },
        update: { canView: true },
        create: {
          prayerRequestId,
          userId,
          canView: true,
        },
      });

      logger.info(`Prayer permission granted: ${prayerRequestId} -> ${userId}`);
    } catch (error) {
      logger.error("Grant prayer permission error:", error);
      throw error;
    }
  }

  async revokePrayerPermission(
    prayerRequestId: string,
    userId: string
  ): Promise<void> {
    try {
      await prisma.prayerPermission.delete({
        where: {
          prayerRequestId_userId: {
            prayerRequestId,
            userId,
          },
        },
      });

      logger.info(`Prayer permission revoked: ${prayerRequestId} -> ${userId}`);
    } catch (error) {
      logger.error("Revoke prayer permission error:", error);
      throw error;
    }
  }

  // ============================================================================
  // GET PRAYER STATISTICS
  // ============================================================================

  async getPrayerStatistics(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    answered: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    try {
      const [
        total,
        pending,
        approved,
        rejected,
        answered,
        byCategory,
        byPriority,
      ] = await Promise.all([
        prisma.prayerRequest.count(),
        prisma.prayerRequest.count({ where: { status: PrayerStatus.PENDING } }),
        prisma.prayerRequest.count({
          where: { status: PrayerStatus.APPROVED },
        }),
        prisma.prayerRequest.count({
          where: { status: PrayerStatus.REJECTED },
        }),
        prisma.prayerRequest.count({ where: { isAnswered: true } }),
        prisma.prayerRequest.groupBy({
          by: ["category"],
          _count: { category: true },
        }),
        prisma.prayerRequest.groupBy({
          by: ["priority"],
          _count: { priority: true },
        }),
      ]);

      return {
        total,
        pending,
        approved,
        rejected,
        answered,
        byCategory: byCategory.reduce((acc, item) => {
          acc[item.category] = item._count.category;
          return acc;
        }, {} as Record<string, number>),
        byPriority: byPriority.reduce((acc, item) => {
          acc[item.priority] = item._count.priority;
          return acc;
        }, {} as Record<string, number>),
      };
    } catch (error) {
      logger.error("Get prayer statistics error:", error);
      throw error;
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  async bulkUpdatePrayerRequests(
    ids: string[],
    data: PrayerRequestUpdateData
  ): Promise<{ count: number }> {
    try {
      const result = await prisma.prayerRequest.updateMany({
        where: { id: { in: ids } },
        data,
      });

      logger.info(`Bulk updated ${result.count} prayer requests`);
      return result;
    } catch (error) {
      logger.error("Bulk update prayer requests error:", error);
      throw error;
    }
  }

  async bulkDeletePrayerRequests(ids: string[]): Promise<{ count: number }> {
    try {
      const result = await prisma.prayerRequest.deleteMany({
        where: { id: { in: ids } },
      });

      logger.info(`Bulk deleted ${result.count} prayer requests`);
      return result;
    } catch (error) {
      logger.error("Bulk delete prayer requests error:", error);
      throw error;
    }
  }
}

export const prayerService = new PrayerService();
