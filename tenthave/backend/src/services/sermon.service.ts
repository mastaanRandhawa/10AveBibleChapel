import { prisma } from "@/config/database";
import { logger } from "@/config/logger";
import { Sermon, SermonSeries, ContentStatus, UserRole } from "@prisma/client";
import {
  SermonCreateData,
  SermonUpdateData,
  SermonSeriesCreateData,
  SermonSeriesUpdateData,
  SermonFilters,
  PaginationQuery,
  PaginationMeta,
} from "@/types";
import { AppError, NotFoundError, AuthorizationError } from "@/utils/errors";
import {
  calculatePagination,
  getPaginationParams,
  createUniqueSlug,
} from "@/utils/helpers";

export class SermonService {
  // ============================================================================
  // SERMON SERIES OPERATIONS
  // ============================================================================

  async createSermonSeries(
    data: SermonSeriesCreateData
  ): Promise<SermonSeries> {
    try {
      // Generate unique slug
      const existingSlugs = await prisma.sermonSeries.findMany({
        select: { slug: true },
      });
      const slug = createUniqueSlug(
        data.title,
        existingSlugs.map((s) => s.slug)
      );

      const sermonSeries = await prisma.sermonSeries.create({
        data: {
          ...data,
          slug,
        },
      });

      logger.info(`Sermon series created: ${sermonSeries.id}`);
      return sermonSeries;
    } catch (error) {
      logger.error("Create sermon series error:", error);
      throw error;
    }
  }

  async getSermonSeries(
    pagination: PaginationQuery = {},
    includeInactive: boolean = false
  ): Promise<{ series: SermonSeries[]; pagination: PaginationMeta }> {
    try {
      const { page, limit, skip, sortBy, sortOrder } =
        getPaginationParams(pagination);

      const where = includeInactive ? {} : { isActive: true };

      const [series, total] = await Promise.all([
        prisma.sermonSeries.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            _count: {
              select: { sermons: true },
            },
          },
        }),
        prisma.sermonSeries.count({ where }),
      ]);

      return {
        series,
        pagination: calculatePagination(page, limit, total),
      };
    } catch (error) {
      logger.error("Get sermon series error:", error);
      throw error;
    }
  }

  async getSermonSeriesById(
    id: string
  ): Promise<SermonSeries & { sermons: Sermon[] }> {
    try {
      const sermonSeries = await prisma.sermonSeries.findUnique({
        where: { id },
        include: {
          sermons: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (!sermonSeries) {
        throw new NotFoundError("Sermon series");
      }

      return sermonSeries;
    } catch (error) {
      logger.error("Get sermon series by ID error:", error);
      throw error;
    }
  }

  async getSermonSeriesBySlug(
    slug: string
  ): Promise<SermonSeries & { sermons: Sermon[] }> {
    try {
      const sermonSeries = await prisma.sermonSeries.findUnique({
        where: { slug },
        include: {
          sermons: {
            where: { status: ContentStatus.PUBLISHED },
            orderBy: { order: "asc" },
          },
        },
      });

      if (!sermonSeries) {
        throw new NotFoundError("Sermon series");
      }

      return sermonSeries;
    } catch (error) {
      logger.error("Get sermon series by slug error:", error);
      throw error;
    }
  }

  async updateSermonSeries(
    id: string,
    data: SermonSeriesUpdateData
  ): Promise<SermonSeries> {
    try {
      const existingSeries = await prisma.sermonSeries.findUnique({
        where: { id },
      });

      if (!existingSeries) {
        throw new NotFoundError("Sermon series");
      }

      // Generate new slug if title changed
      let slug = existingSeries.slug;
      if (data.title && data.title !== existingSeries.title) {
        const existingSlugs = await prisma.sermonSeries.findMany({
          select: { slug: true },
          where: { id: { not: id } },
        });
        slug = createUniqueSlug(
          data.title,
          existingSlugs.map((s) => s.slug)
        );
      }

      const sermonSeries = await prisma.sermonSeries.update({
        where: { id },
        data: {
          ...data,
          slug,
        },
      });

      logger.info(`Sermon series updated: ${id}`);
      return sermonSeries;
    } catch (error) {
      logger.error("Update sermon series error:", error);
      throw error;
    }
  }

  async deleteSermonSeries(id: string): Promise<void> {
    try {
      const existingSeries = await prisma.sermonSeries.findUnique({
        where: { id },
        include: { _count: { select: { sermons: true } } },
      });

      if (!existingSeries) {
        throw new NotFoundError("Sermon series");
      }

      if (existingSeries._count.sermons > 0) {
        throw new AppError(
          "Cannot delete sermon series with existing sermons",
          400
        );
      }

      await prisma.sermonSeries.delete({
        where: { id },
      });

      logger.info(`Sermon series deleted: ${id}`);
    } catch (error) {
      logger.error("Delete sermon series error:", error);
      throw error;
    }
  }

  // ============================================================================
  // SERMON OPERATIONS
  // ============================================================================

  async createSermon(data: SermonCreateData): Promise<Sermon> {
    try {
      // Generate unique slug
      const existingSlugs = await prisma.sermon.findMany({
        select: { slug: true },
      });
      const slug = createUniqueSlug(
        data.title,
        existingSlugs.map((s) => s.slug)
      );

      const sermon = await prisma.sermon.create({
        data: {
          ...data,
          slug,
        },
        include: {
          series: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });

      logger.info(`Sermon created: ${sermon.id}`);
      return sermon;
    } catch (error) {
      logger.error("Create sermon error:", error);
      throw error;
    }
  }

  async getSermons(
    filters: SermonFilters = {},
    pagination: PaginationQuery = {},
    currentUser?: { role: UserRole }
  ): Promise<{ sermons: Sermon[]; pagination: PaginationMeta }> {
    try {
      const { page, limit, skip, sortBy, sortOrder } =
        getPaginationParams(pagination);

      // Build where clause
      const where: any = {};

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        where.status = { in: filters.status };
      } else if (!currentUser || currentUser.role === UserRole.GUEST) {
        // Non-admin users only see published sermons
        where.status = ContentStatus.PUBLISHED;
      }

      if (filters.isFeatured !== undefined) {
        where.isFeatured = filters.isFeatured;
      }

      if (filters.seriesId) {
        where.seriesId = filters.seriesId;
      }

      if (filters.speaker) {
        where.speaker = { contains: filters.speaker, mode: "insensitive" };
      }

      if (filters.dateFrom || filters.dateTo) {
        where.date = {};
        if (filters.dateFrom) where.date.gte = filters.dateFrom;
        if (filters.dateTo) where.date.lte = filters.dateTo;
      }

      const [sermons, total] = await Promise.all([
        prisma.sermon.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            series: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        }),
        prisma.sermon.count({ where }),
      ]);

      return {
        sermons,
        pagination: calculatePagination(page, limit, total),
      };
    } catch (error) {
      logger.error("Get sermons error:", error);
      throw error;
    }
  }

  async getSermonById(
    id: string,
    currentUser?: { role: UserRole }
  ): Promise<Sermon> {
    try {
      const sermon = await prisma.sermon.findUnique({
        where: { id },
        include: {
          series: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });

      if (!sermon) {
        throw new NotFoundError("Sermon");
      }

      // Check if user can view this sermon
      if (
        sermon.status !== ContentStatus.PUBLISHED &&
        (!currentUser || currentUser.role === UserRole.GUEST)
      ) {
        throw new AuthorizationError(
          "You do not have permission to view this sermon"
        );
      }

      return sermon;
    } catch (error) {
      logger.error("Get sermon by ID error:", error);
      throw error;
    }
  }

  async getSermonBySlug(
    slug: string,
    currentUser?: { role: UserRole }
  ): Promise<Sermon> {
    try {
      const sermon = await prisma.sermon.findUnique({
        where: { slug },
        include: {
          series: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });

      if (!sermon) {
        throw new NotFoundError("Sermon");
      }

      // Check if user can view this sermon
      if (
        sermon.status !== ContentStatus.PUBLISHED &&
        (!currentUser || currentUser.role === UserRole.GUEST)
      ) {
        throw new AuthorizationError(
          "You do not have permission to view this sermon"
        );
      }

      return sermon;
    } catch (error) {
      logger.error("Get sermon by slug error:", error);
      throw error;
    }
  }

  async updateSermon(id: string, data: SermonUpdateData): Promise<Sermon> {
    try {
      const existingSermon = await prisma.sermon.findUnique({
        where: { id },
      });

      if (!existingSermon) {
        throw new NotFoundError("Sermon");
      }

      // Generate new slug if title changed
      let slug = existingSermon.slug;
      if (data.title && data.title !== existingSermon.title) {
        const existingSlugs = await prisma.sermon.findMany({
          select: { slug: true },
          where: { id: { not: id } },
        });
        slug = createUniqueSlug(
          data.title,
          existingSlugs.map((s) => s.slug)
        );
      }

      const sermon = await prisma.sermon.update({
        where: { id },
        data: {
          ...data,
          slug,
        },
        include: {
          series: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });

      logger.info(`Sermon updated: ${id}`);
      return sermon;
    } catch (error) {
      logger.error("Update sermon error:", error);
      throw error;
    }
  }

  async deleteSermon(id: string): Promise<void> {
    try {
      const existingSermon = await prisma.sermon.findUnique({
        where: { id },
      });

      if (!existingSermon) {
        throw new NotFoundError("Sermon");
      }

      await prisma.sermon.delete({
        where: { id },
      });

      logger.info(`Sermon deleted: ${id}`);
    } catch (error) {
      logger.error("Delete sermon error:", error);
      throw error;
    }
  }

  // ============================================================================
  // FEATURED SERMONS
  // ============================================================================

  async getFeaturedSermons(limit: number = 5): Promise<Sermon[]> {
    try {
      const sermons = await prisma.sermon.findMany({
        where: {
          isFeatured: true,
          status: ContentStatus.PUBLISHED,
        },
        take: limit,
        orderBy: { date: "desc" },
        include: {
          series: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });

      return sermons;
    } catch (error) {
      logger.error("Get featured sermons error:", error);
      throw error;
    }
  }

  async setFeaturedSermon(id: string, isFeatured: boolean): Promise<Sermon> {
    try {
      const sermon = await prisma.sermon.update({
        where: { id },
        data: { isFeatured },
        include: {
          series: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });

      logger.info(`Sermon featured status updated: ${id} -> ${isFeatured}`);
      return sermon;
    } catch (error) {
      logger.error("Set featured sermon error:", error);
      throw error;
    }
  }

  // ============================================================================
  // SERMON STATISTICS
  // ============================================================================

  async getSermonStatistics(): Promise<{
    total: number;
    published: number;
    draft: number;
    archived: number;
    featured: number;
    bySpeaker: Record<string, number>;
    bySeries: Record<string, number>;
  }> {
    try {
      const [total, published, draft, archived, featured, bySpeaker, bySeries] =
        await Promise.all([
          prisma.sermon.count(),
          prisma.sermon.count({ where: { status: ContentStatus.PUBLISHED } }),
          prisma.sermon.count({ where: { status: ContentStatus.DRAFT } }),
          prisma.sermon.count({ where: { status: ContentStatus.ARCHIVED } }),
          prisma.sermon.count({ where: { isFeatured: true } }),
          prisma.sermon.groupBy({
            by: ["speaker"],
            _count: { speaker: true },
          }),
          prisma.sermon.groupBy({
            by: ["seriesId"],
            _count: { seriesId: true },
          }),
        ]);

      return {
        total,
        published,
        draft,
        archived,
        featured,
        bySpeaker: bySpeaker.reduce((acc, item) => {
          acc[item.speaker] = item._count.speaker;
          return acc;
        }, {} as Record<string, number>),
        bySeries: bySeries.reduce((acc, item) => {
          acc[item.seriesId || "No Series"] = item._count.seriesId;
          return acc;
        }, {} as Record<string, number>),
      };
    } catch (error) {
      logger.error("Get sermon statistics error:", error);
      throw error;
    }
  }

  // ============================================================================
  // SEARCH SERMONS
  // ============================================================================

  async searchSermons(
    query: string,
    pagination: PaginationQuery = {},
    currentUser?: { role: UserRole }
  ): Promise<{ sermons: Sermon[]; pagination: PaginationMeta }> {
    try {
      const { page, limit, skip, sortBy, sortOrder } =
        getPaginationParams(pagination);

      const where: any = {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { subtitle: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { speaker: { contains: query, mode: "insensitive" } },
          { passage: { contains: query, mode: "insensitive" } },
        ],
      };

      // Apply user permissions
      if (!currentUser || currentUser.role === UserRole.GUEST) {
        where.status = ContentStatus.PUBLISHED;
      }

      const [sermons, total] = await Promise.all([
        prisma.sermon.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            series: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        }),
        prisma.sermon.count({ where }),
      ]);

      return {
        sermons,
        pagination: calculatePagination(page, limit, total),
      };
    } catch (error) {
      logger.error("Search sermons error:", error);
      throw error;
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  async bulkUpdateSermons(
    ids: string[],
    data: SermonUpdateData
  ): Promise<{ count: number }> {
    try {
      const result = await prisma.sermon.updateMany({
        where: { id: { in: ids } },
        data,
      });

      logger.info(`Bulk updated ${result.count} sermons`);
      return result;
    } catch (error) {
      logger.error("Bulk update sermons error:", error);
      throw error;
    }
  }

  async bulkDeleteSermons(ids: string[]): Promise<{ count: number }> {
    try {
      const result = await prisma.sermon.deleteMany({
        where: { id: { in: ids } },
      });

      logger.info(`Bulk deleted ${result.count} sermons`);
      return result;
    } catch (error) {
      logger.error("Bulk delete sermons error:", error);
      throw error;
    }
  }
}

export const sermonService = new SermonService();
