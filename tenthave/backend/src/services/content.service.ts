import { prisma } from "@/config/database";
import { logger } from "@/config/logger";
import {
  Service,
  Ministry,
  AboutSection,
  ContactInfo,
  ServiceType,
  ContentStatus,
  UserRole,
} from "@prisma/client";
import {
  ServiceCreateData,
  ServiceUpdateData,
  MinistryCreateData,
  MinistryUpdateData,
  AboutSectionCreateData,
  AboutSectionUpdateData,
  ContactInfoUpdateData,
  PaginationQuery,
  PaginationMeta,
} from "@/types";
import { AppError, NotFoundError } from "@/utils/errors";
import {
  calculatePagination,
  getPaginationParams,
  createUniqueSlug,
} from "@/utils/helpers";

export class ContentService {
  // ============================================================================
  // SERVICE OPERATIONS
  // ============================================================================

  async createService(data: ServiceCreateData): Promise<Service> {
    try {
      const service = await prisma.service.create({
        data,
      });

      logger.info(`Service created: ${service.id}`);
      return service;
    } catch (error) {
      logger.error("Create service error:", error);
      throw error;
    }
  }

  async getServices(
    type?: ServiceType,
    includeInactive: boolean = false
  ): Promise<Service[]> {
    try {
      const where: any = {};

      if (type) {
        where.type = type;
      }

      if (!includeInactive) {
        where.isActive = true;
      }

      const services = await prisma.service.findMany({
        where,
        orderBy: { order: "asc" },
      });

      return services;
    } catch (error) {
      logger.error("Get services error:", error);
      throw error;
    }
  }

  async getServiceById(id: string): Promise<Service> {
    try {
      const service = await prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        throw new NotFoundError("Service");
      }

      return service;
    } catch (error) {
      logger.error("Get service by ID error:", error);
      throw error;
    }
  }

  async updateService(id: string, data: ServiceUpdateData): Promise<Service> {
    try {
      const existingService = await prisma.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        throw new NotFoundError("Service");
      }

      const service = await prisma.service.update({
        where: { id },
        data,
      });

      logger.info(`Service updated: ${id}`);
      return service;
    } catch (error) {
      logger.error("Update service error:", error);
      throw error;
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      const existingService = await prisma.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        throw new NotFoundError("Service");
      }

      await prisma.service.delete({
        where: { id },
      });

      logger.info(`Service deleted: ${id}`);
    } catch (error) {
      logger.error("Delete service error:", error);
      throw error;
    }
  }

  // ============================================================================
  // MINISTRY OPERATIONS
  // ============================================================================

  async createMinistry(data: MinistryCreateData): Promise<Ministry> {
    try {
      const ministry = await prisma.ministry.create({
        data,
      });

      logger.info(`Ministry created: ${ministry.id}`);
      return ministry;
    } catch (error) {
      logger.error("Create ministry error:", error);
      throw error;
    }
  }

  async getMinistries(includeInactive: boolean = false): Promise<Ministry[]> {
    try {
      const where = includeInactive ? {} : { isActive: true };

      const ministries = await prisma.ministry.findMany({
        where,
        orderBy: { order: "asc" },
      });

      return ministries;
    } catch (error) {
      logger.error("Get ministries error:", error);
      throw error;
    }
  }

  async getMinistryById(id: string): Promise<Ministry> {
    try {
      const ministry = await prisma.ministry.findUnique({
        where: { id },
      });

      if (!ministry) {
        throw new NotFoundError("Ministry");
      }

      return ministry;
    } catch (error) {
      logger.error("Get ministry by ID error:", error);
      throw error;
    }
  }

  async updateMinistry(
    id: string,
    data: MinistryUpdateData
  ): Promise<Ministry> {
    try {
      const existingMinistry = await prisma.ministry.findUnique({
        where: { id },
      });

      if (!existingMinistry) {
        throw new NotFoundError("Ministry");
      }

      const ministry = await prisma.ministry.update({
        where: { id },
        data,
      });

      logger.info(`Ministry updated: ${id}`);
      return ministry;
    } catch (error) {
      logger.error("Update ministry error:", error);
      throw error;
    }
  }

  async deleteMinistry(id: string): Promise<void> {
    try {
      const existingMinistry = await prisma.ministry.findUnique({
        where: { id },
      });

      if (!existingMinistry) {
        throw new NotFoundError("Ministry");
      }

      await prisma.ministry.delete({
        where: { id },
      });

      logger.info(`Ministry deleted: ${id}`);
    } catch (error) {
      logger.error("Delete ministry error:", error);
      throw error;
    }
  }

  // ============================================================================
  // ABOUT SECTION OPERATIONS
  // ============================================================================

  async createAboutSection(
    data: AboutSectionCreateData
  ): Promise<AboutSection> {
    try {
      // Generate unique slug
      const existingSlugs = await prisma.aboutSection.findMany({
        select: { slug: true },
      });
      const slug = createUniqueSlug(
        data.title,
        existingSlugs.map((s) => s.slug)
      );

      const aboutSection = await prisma.aboutSection.create({
        data: {
          ...data,
          slug,
        },
      });

      logger.info(`About section created: ${aboutSection.id}`);
      return aboutSection;
    } catch (error) {
      logger.error("Create about section error:", error);
      throw error;
    }
  }

  async getAboutSections(
    includeUnpublished: boolean = false
  ): Promise<AboutSection[]> {
    try {
      const where = includeUnpublished
        ? {}
        : { status: ContentStatus.PUBLISHED };

      const aboutSections = await prisma.aboutSection.findMany({
        where,
        orderBy: { order: "asc" },
      });

      return aboutSections;
    } catch (error) {
      logger.error("Get about sections error:", error);
      throw error;
    }
  }

  async getAboutSectionById(id: string): Promise<AboutSection> {
    try {
      const aboutSection = await prisma.aboutSection.findUnique({
        where: { id },
      });

      if (!aboutSection) {
        throw new NotFoundError("About section");
      }

      return aboutSection;
    } catch (error) {
      logger.error("Get about section by ID error:", error);
      throw error;
    }
  }

  async getAboutSectionBySlug(slug: string): Promise<AboutSection> {
    try {
      const aboutSection = await prisma.aboutSection.findUnique({
        where: { slug },
      });

      if (!aboutSection) {
        throw new NotFoundError("About section");
      }

      return aboutSection;
    } catch (error) {
      logger.error("Get about section by slug error:", error);
      throw error;
    }
  }

  async updateAboutSection(
    id: string,
    data: AboutSectionUpdateData
  ): Promise<AboutSection> {
    try {
      const existingSection = await prisma.aboutSection.findUnique({
        where: { id },
      });

      if (!existingSection) {
        throw new NotFoundError("About section");
      }

      // Generate new slug if title changed
      let slug = existingSection.slug;
      if (data.title && data.title !== existingSection.title) {
        const existingSlugs = await prisma.aboutSection.findMany({
          select: { slug: true },
          where: { id: { not: id } },
        });
        slug = createUniqueSlug(
          data.title,
          existingSlugs.map((s) => s.slug)
        );
      }

      const aboutSection = await prisma.aboutSection.update({
        where: { id },
        data: {
          ...data,
          slug,
        },
      });

      logger.info(`About section updated: ${id}`);
      return aboutSection;
    } catch (error) {
      logger.error("Update about section error:", error);
      throw error;
    }
  }

  async deleteAboutSection(id: string): Promise<void> {
    try {
      const existingSection = await prisma.aboutSection.findUnique({
        where: { id },
      });

      if (!existingSection) {
        throw new NotFoundError("About section");
      }

      await prisma.aboutSection.delete({
        where: { id },
      });

      logger.info(`About section deleted: ${id}`);
    } catch (error) {
      logger.error("Delete about section error:", error);
      throw error;
    }
  }

  // ============================================================================
  // CONTACT INFO OPERATIONS
  // ============================================================================

  async getContactInfo(): Promise<ContactInfo | null> {
    try {
      const contactInfo = await prisma.contactInfo.findFirst({
        orderBy: { createdAt: "desc" },
      });

      return contactInfo;
    } catch (error) {
      logger.error("Get contact info error:", error);
      throw error;
    }
  }

  async updateContactInfo(data: ContactInfoUpdateData): Promise<ContactInfo> {
    try {
      // Get existing contact info or create new one
      const existingContactInfo = await prisma.contactInfo.findFirst();

      let contactInfo: ContactInfo;

      if (existingContactInfo) {
        contactInfo = await prisma.contactInfo.update({
          where: { id: existingContactInfo.id },
          data,
        });
      } else {
        // Create new contact info with required fields
        contactInfo = await prisma.contactInfo.create({
          data: {
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            ...data,
          },
        });
      }

      logger.info(`Contact info updated: ${contactInfo.id}`);
      return contactInfo;
    } catch (error) {
      logger.error("Update contact info error:", error);
      throw error;
    }
  }

  // ============================================================================
  // CONTENT AUDIT TRAIL
  // ============================================================================

  async logContentEdit(
    entityType: string,
    entityId: string,
    fieldName: string,
    oldValue: string | null,
    newValue: string | null,
    userId: string
  ): Promise<void> {
    try {
      await prisma.contentEdit.create({
        data: {
          entityType,
          entityId,
          fieldName,
          oldValue,
          newValue,
          userId,
        },
      });

      logger.info(
        `Content edit logged: ${entityType}:${entityId} - ${fieldName}`
      );
    } catch (error) {
      logger.error("Log content edit error:", error);
      // Don't throw error for audit logging failures
    }
  }

  async getContentEditHistory(
    entityType: string,
    entityId: string,
    pagination: PaginationQuery = {}
  ): Promise<{ edits: any[]; pagination: PaginationMeta }> {
    try {
      const { page, limit, skip, sortBy, sortOrder } =
        getPaginationParams(pagination);

      const where = {
        entityType,
        entityId,
      };

      const [edits, total] = await Promise.all([
        prisma.contentEdit.findMany({
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
          },
        }),
        prisma.contentEdit.count({ where }),
      ]);

      return {
        edits,
        pagination: calculatePagination(page, limit, total),
      };
    } catch (error) {
      logger.error("Get content edit history error:", error);
      throw error;
    }
  }

  // ============================================================================
  // CONTENT STATISTICS
  // ============================================================================

  async getContentStatistics(): Promise<{
    services: { total: number; active: number; byType: Record<string, number> };
    ministries: { total: number; active: number };
    aboutSections: { total: number; published: number; draft: number };
    recentEdits: number;
  }> {
    try {
      const [
        servicesTotal,
        servicesActive,
        servicesByType,
        ministriesTotal,
        ministriesActive,
        aboutSectionsTotal,
        aboutSectionsPublished,
        aboutSectionsDraft,
        recentEdits,
      ] = await Promise.all([
        prisma.service.count(),
        prisma.service.count({ where: { isActive: true } }),
        prisma.service.groupBy({
          by: ["type"],
          _count: { type: true },
        }),
        prisma.ministry.count(),
        prisma.ministry.count({ where: { isActive: true } }),
        prisma.aboutSection.count(),
        prisma.aboutSection.count({
          where: { status: ContentStatus.PUBLISHED },
        }),
        prisma.aboutSection.count({ where: { status: ContentStatus.DRAFT } }),
        prisma.contentEdit.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
      ]);

      return {
        services: {
          total: servicesTotal,
          active: servicesActive,
          byType: servicesByType.reduce((acc, item) => {
            acc[item.type] = item._count.type;
            return acc;
          }, {} as Record<string, number>),
        },
        ministries: {
          total: ministriesTotal,
          active: ministriesActive,
        },
        aboutSections: {
          total: aboutSectionsTotal,
          published: aboutSectionsPublished,
          draft: aboutSectionsDraft,
        },
        recentEdits,
      };
    } catch (error) {
      logger.error("Get content statistics error:", error);
      throw error;
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  async bulkUpdateServices(
    ids: string[],
    data: ServiceUpdateData
  ): Promise<{ count: number }> {
    try {
      const result = await prisma.service.updateMany({
        where: { id: { in: ids } },
        data,
      });

      logger.info(`Bulk updated ${result.count} services`);
      return result;
    } catch (error) {
      logger.error("Bulk update services error:", error);
      throw error;
    }
  }

  async bulkUpdateMinistries(
    ids: string[],
    data: MinistryUpdateData
  ): Promise<{ count: number }> {
    try {
      const result = await prisma.ministry.updateMany({
        where: { id: { in: ids } },
        data,
      });

      logger.info(`Bulk updated ${result.count} ministries`);
      return result;
    } catch (error) {
      logger.error("Bulk update ministries error:", error);
      throw error;
    }
  }

  async bulkUpdateAboutSections(
    ids: string[],
    data: AboutSectionUpdateData
  ): Promise<{ count: number }> {
    try {
      const result = await prisma.aboutSection.updateMany({
        where: { id: { in: ids } },
        data,
      });

      logger.info(`Bulk updated ${result.count} about sections`);
      return result;
    } catch (error) {
      logger.error("Bulk update about sections error:", error);
      throw error;
    }
  }
}

export const contentService = new ContentService();
