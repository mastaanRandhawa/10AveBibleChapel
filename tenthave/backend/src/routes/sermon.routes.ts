import { Router, Request, Response } from "express";
import { AuthRequest } from "@/types";
import { sermonService } from "@/services/sermon.service";
import {
  authenticate,
  requireAdmin,
  optionalAuth,
} from "@/middleware/auth.middleware";
import { asyncHandler } from "@/middleware/error.middleware";
import {
  validateSermonCreate,
  validateSermonSeriesCreate,
  validateSermonFilters,
  validateSearchQuery,
  validatePagination,
  validateIdParam,
  validateSlugParam,
} from "@/middleware/validation.middleware";

const router = Router();

// ============================================================================
// SERMON SERIES ROUTES
// ============================================================================

// Get sermon series
router.get(
  "/series",
  optionalAuth,
  validatePagination,
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const includeInactive = req.query.includeInactive === "true";

    const result = await sermonService.getSermonSeries(
      { page, limit },
      includeInactive
    );

    res.status(200).json({
      success: true,
      data: result.series,
      pagination: result.pagination,
    });
  })
);

// Get sermon series by ID
router.get(
  "/series/:id",
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const series = await sermonService.getSermonSeriesById(id);

    res.status(200).json({
      success: true,
      data: series,
    });
  })
);

// Get sermon series by slug
router.get(
  "/series/slug/:slug",
  validateSlugParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const series = await sermonService.getSermonSeriesBySlug(slug);

    res.status(200).json({
      success: true,
      data: series,
    });
  })
);

// Create sermon series (admin only)
router.post(
  "/series",
  authenticate,
  requireAdmin,
  validateSermonSeriesCreate,
  asyncHandler(async (req: Request, res: Response) => {
    const seriesData = req.body;

    const series = await sermonService.createSermonSeries(seriesData);

    res.status(201).json({
      success: true,
      message: "Sermon series created successfully",
      data: series,
    });
  })
);

// Update sermon series (admin only)
router.put(
  "/series/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const series = await sermonService.updateSermonSeries(id, updateData);

    res.status(200).json({
      success: true,
      message: "Sermon series updated successfully",
      data: series,
    });
  })
);

// Delete sermon series (admin only)
router.delete(
  "/series/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await sermonService.deleteSermonSeries(id);

    res.status(200).json({
      success: true,
      message: "Sermon series deleted successfully",
    });
  })
);

// ============================================================================
// SERMON ROUTES
// ============================================================================

// Get sermons
router.get(
  "/",
  optionalAuth,
  validatePagination,
  validateSermonFilters,
  asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      status: req.query.status
        ? Array.isArray(req.query.status)
          ? (req.query.status as any[])
          : [req.query.status as any]
        : undefined,
      isFeatured: req.query.isFeatured
        ? req.query.isFeatured === "true"
        : undefined,
      seriesId: req.query.seriesId as string,
      speaker: req.query.speaker as string,
      dateFrom: req.query.dateFrom
        ? new Date(req.query.dateFrom as string)
        : undefined,
      dateTo: req.query.dateTo
        ? new Date(req.query.dateTo as string)
        : undefined,
    };

    const pagination = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };

    const currentUser = (req as AuthRequest).user
      ? { role: (req as AuthRequest).user!.role }
      : undefined;

    const result = await sermonService.getSermons(
      filters,
      pagination,
      currentUser
    );

    res.status(200).json({
      success: true,
      data: result.sermons,
      pagination: result.pagination,
    });
  })
);

// Get sermon by ID
router.get(
  "/:id",
  validateIdParam,
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = (req as AuthRequest).user
      ? { role: (req as AuthRequest).user!.role }
      : undefined;

    const sermon = await sermonService.getSermonById(id, currentUser);

    res.status(200).json({
      success: true,
      data: sermon,
    });
  })
);

// Get sermon by slug
router.get(
  "/slug/:slug",
  validateSlugParam,
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const currentUser = (req as AuthRequest).user
      ? { role: (req as AuthRequest).user!.role }
      : undefined;

    const sermon = await sermonService.getSermonBySlug(slug, currentUser);

    res.status(200).json({
      success: true,
      data: sermon,
    });
  })
);

// Create sermon (admin only)
router.post(
  "/",
  authenticate,
  requireAdmin,
  validateSermonCreate,
  asyncHandler(async (req: Request, res: Response) => {
    const sermonData = req.body;

    const sermon = await sermonService.createSermon(sermonData);

    res.status(201).json({
      success: true,
      message: "Sermon created successfully",
      data: sermon,
    });
  })
);

// Update sermon (admin only)
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const sermon = await sermonService.updateSermon(id, updateData);

    res.status(200).json({
      success: true,
      message: "Sermon updated successfully",
      data: sermon,
    });
  })
);

// Delete sermon (admin only)
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await sermonService.deleteSermon(id);

    res.status(200).json({
      success: true,
      message: "Sermon deleted successfully",
    });
  })
);

// ============================================================================
// FEATURED SERMONS
// ============================================================================

// Get featured sermons
router.get(
  "/featured/list",
  asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 5;

    const sermons = await sermonService.getFeaturedSermons(limit);

    res.status(200).json({
      success: true,
      data: sermons,
    });
  })
);

// Set featured sermon (admin only)
router.patch(
  "/:id/featured",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const sermon = await sermonService.setFeaturedSermon(id, isFeatured);

    res.status(200).json({
      success: true,
      message: `Sermon ${isFeatured ? "featured" : "unfeatured"} successfully`,
      data: sermon,
    });
  })
);

// ============================================================================
// SEARCH AND STATISTICS
// ============================================================================

// Search sermons
router.get(
  "/search/query",
  optionalAuth,
  validatePagination,
  validateSearchQuery,
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const pagination = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };
    const currentUser = (req as AuthRequest).user
      ? { role: (req as AuthRequest).user!.role }
      : undefined;

    const result = await sermonService.searchSermons(
      query,
      pagination,
      currentUser
    );

    res.status(200).json({
      success: true,
      data: result.sermons,
      pagination: result.pagination,
    });
  })
);

// Get sermon statistics (admin only)
router.get(
  "/admin/statistics",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const statistics = await sermonService.getSermonStatistics();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  })
);

// ============================================================================
// BULK OPERATIONS (admin only)
// ============================================================================

// Bulk update sermons
router.patch(
  "/bulk/update",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { ids, data } = req.body;

    const result = await sermonService.bulkUpdateSermons(ids, data);

    res.status(200).json({
      success: true,
      message: `${result.count} sermons updated successfully`,
      data: result,
    });
  })
);

// Bulk delete sermons
router.delete(
  "/bulk/delete",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;

    const result = await sermonService.bulkDeleteSermons(ids);

    res.status(200).json({
      success: true,
      message: `${result.count} sermons deleted successfully`,
      data: result,
    });
  })
);

export default router;
