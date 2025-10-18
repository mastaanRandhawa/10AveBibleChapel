import { Router, Request, Response } from "express";
import { AuthRequest } from "@/types";
import { contentService } from "@/services/content.service";
import {
  authenticate,
  requireAdmin,
  optionalAuth,
} from "@/middleware/auth.middleware";
import { asyncHandler } from "@/middleware/error.middleware";
import {
  validateServiceCreate,
  validateAboutSectionCreate,
  validateContactInfoUpdate,
  validatePagination,
  validateIdParam,
  validateSlugParam,
} from "@/middleware/validation.middleware";

const router = Router();

// ============================================================================
// SERVICE ROUTES
// ============================================================================

// Get services
router.get(
  "/services",
  asyncHandler(async (req: Request, res: Response) => {
    const type = req.query.type as any;
    const includeInactive = req.query.includeInactive === "true";

    const services = await contentService.getServices(type, includeInactive);

    res.status(200).json({
      success: true,
      data: services,
    });
  })
);

// Get service by ID
router.get(
  "/services/:id",
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const service = await contentService.getServiceById(id);

    res.status(200).json({
      success: true,
      data: service,
    });
  })
);

// Create service (admin only)
router.post(
  "/services",
  authenticate,
  requireAdmin,
  validateServiceCreate,
  asyncHandler(async (req: Request, res: Response) => {
    const serviceData = req.body;

    const service = await contentService.createService(serviceData);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  })
);

// Update service (admin only)
router.put(
  "/services/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const service = await contentService.updateService(id, updateData);

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  })
);

// Delete service (admin only)
router.delete(
  "/services/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await contentService.deleteService(id);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  })
);

// ============================================================================
// MINISTRY ROUTES
// ============================================================================

// Get ministries
router.get(
  "/ministries",
  asyncHandler(async (req: Request, res: Response) => {
    const includeInactive = req.query.includeInactive === "true";

    const ministries = await contentService.getMinistries(includeInactive);

    res.status(200).json({
      success: true,
      data: ministries,
    });
  })
);

// Get ministry by ID
router.get(
  "/ministries/:id",
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const ministry = await contentService.getMinistryById(id);

    res.status(200).json({
      success: true,
      data: ministry,
    });
  })
);

// Create ministry (admin only)
router.post(
  "/ministries",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const ministryData = req.body;

    const ministry = await contentService.createMinistry(ministryData);

    res.status(201).json({
      success: true,
      message: "Ministry created successfully",
      data: ministry,
    });
  })
);

// Update ministry (admin only)
router.put(
  "/ministries/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const ministry = await contentService.updateMinistry(id, updateData);

    res.status(200).json({
      success: true,
      message: "Ministry updated successfully",
      data: ministry,
    });
  })
);

// Delete ministry (admin only)
router.delete(
  "/ministries/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await contentService.deleteMinistry(id);

    res.status(200).json({
      success: true,
      message: "Ministry deleted successfully",
    });
  })
);

// ============================================================================
// ABOUT SECTION ROUTES
// ============================================================================

// Get about sections
router.get(
  "/about-sections",
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const includeUnpublished =
      (req as AuthRequest).user?.role === "ADMIN" &&
      req.query.includeUnpublished === "true";

    const aboutSections = await contentService.getAboutSections(
      includeUnpublished
    );

    res.status(200).json({
      success: true,
      data: aboutSections,
    });
  })
);

// Get about section by ID
router.get(
  "/about-sections/:id",
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const aboutSection = await contentService.getAboutSectionById(id);

    res.status(200).json({
      success: true,
      data: aboutSection,
    });
  })
);

// Get about section by slug
router.get(
  "/about-sections/slug/:slug",
  validateSlugParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const aboutSection = await contentService.getAboutSectionBySlug(slug);

    res.status(200).json({
      success: true,
      data: aboutSection,
    });
  })
);

// Create about section (admin only)
router.post(
  "/about-sections",
  authenticate,
  requireAdmin,
  validateAboutSectionCreate,
  asyncHandler(async (req: Request, res: Response) => {
    const sectionData = req.body;

    const aboutSection = await contentService.createAboutSection(sectionData);

    res.status(201).json({
      success: true,
      message: "About section created successfully",
      data: aboutSection,
    });
  })
);

// Update about section (admin only)
router.put(
  "/about-sections/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const aboutSection = await contentService.updateAboutSection(
      id,
      updateData
    );

    res.status(200).json({
      success: true,
      message: "About section updated successfully",
      data: aboutSection,
    });
  })
);

// Delete about section (admin only)
router.delete(
  "/about-sections/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await contentService.deleteAboutSection(id);

    res.status(200).json({
      success: true,
      message: "About section deleted successfully",
    });
  })
);

// ============================================================================
// CONTACT INFO ROUTES
// ============================================================================

// Get contact info
router.get(
  "/contact-info",
  asyncHandler(async (req: Request, res: Response) => {
    const contactInfo = await contentService.getContactInfo();

    res.status(200).json({
      success: true,
      data: contactInfo,
    });
  })
);

// Update contact info (admin only)
router.put(
  "/contact-info",
  authenticate,
  requireAdmin,
  validateContactInfoUpdate,
  asyncHandler(async (req: Request, res: Response) => {
    const updateData = req.body;

    const contactInfo = await contentService.updateContactInfo(updateData);

    res.status(200).json({
      success: true,
      message: "Contact info updated successfully",
      data: contactInfo,
    });
  })
);

// ============================================================================
// CONTENT AUDIT TRAIL
// ============================================================================

// Get content edit history
router.get(
  "/edit-history/:entityType/:entityId",
  authenticate,
  requireAdmin,
  validatePagination,
  asyncHandler(async (req: Request, res: Response) => {
    const { entityType, entityId } = req.params;
    const pagination = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };

    const result = await contentService.getContentEditHistory(
      entityType,
      entityId,
      pagination
    );

    res.status(200).json({
      success: true,
      data: result.edits,
      pagination: result.pagination,
    });
  })
);

// ============================================================================
// CONTENT STATISTICS
// ============================================================================

// Get content statistics (admin only)
router.get(
  "/statistics",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const statistics = await contentService.getContentStatistics();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  })
);

// ============================================================================
// BULK OPERATIONS (admin only)
// ============================================================================

// Bulk update services
router.patch(
  "/services/bulk/update",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { ids, data } = req.body;

    const result = await contentService.bulkUpdateServices(ids, data);

    res.status(200).json({
      success: true,
      message: `${result.count} services updated successfully`,
      data: result,
    });
  })
);

// Bulk update ministries
router.patch(
  "/ministries/bulk/update",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { ids, data } = req.body;

    const result = await contentService.bulkUpdateMinistries(ids, data);

    res.status(200).json({
      success: true,
      message: `${result.count} ministries updated successfully`,
      data: result,
    });
  })
);

// Bulk update about sections
router.patch(
  "/about-sections/bulk/update",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { ids, data } = req.body;

    const result = await contentService.bulkUpdateAboutSections(ids, data);

    res.status(200).json({
      success: true,
      message: `${result.count} about sections updated successfully`,
      data: result,
    });
  })
);

export default router;
