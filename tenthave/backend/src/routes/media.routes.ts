import { Router, Request, Response } from "express";
import { mediaService } from "@/services/media.service";
import {
  authenticate,
  requireAdmin,
  fileUploadRateLimit,
} from "@/middleware/auth.middleware";
import { asyncHandler } from "@/middleware/error.middleware";
import {
  validateFileUpload,
  validateIdParam,
} from "@/middleware/validation.middleware";

const router = Router();

// ============================================================================
// FILE UPLOAD ROUTES
// ============================================================================

// Upload single file
router.post(
  "/upload",
  authenticate,
  fileUploadRateLimit,
  mediaService.getUploadMiddleware().single("file"),
  validateFileUpload,
  asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    const { entityType, entityId } = req.body;

    const result = await mediaService.uploadFile(file!, entityType, entityId);

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  })
);

// Upload multiple files
router.post(
  "/upload/multiple",
  authenticate,
  fileUploadRateLimit,
  mediaService.getUploadMiddleware().array("files", 10),
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const { entityType, entityId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files provided",
      });
    }

    const results = await mediaService.uploadMultipleFiles(
      files,
      entityType,
      entityId
    );

    return res.status(201).json({
      success: true,
      message: `${files.length} files uploaded successfully`,
      data: results,
    });
  })
);

// ============================================================================
// FILE MANAGEMENT ROUTES
// ============================================================================

// Get file by ID
router.get(
  "/:id",
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const file = await mediaService.getFileById(id);

    res.status(200).json({
      success: true,
      data: file,
    });
  })
);

// Get files by entity
router.get(
  "/entity/:entityType/:entityId",
  asyncHandler(async (req: Request, res: Response) => {
    const { entityType, entityId } = req.params;

    const files = await mediaService.getFilesByEntity(entityType, entityId);

    res.status(200).json({
      success: true,
      data: files,
    });
  })
);

// Update file metadata
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { entityType, entityId } = req.body;

    const file = await mediaService.updateFileMetadata(id, {
      entityType,
      entityId,
    });

    res.status(200).json({
      success: true,
      message: "File metadata updated successfully",
      data: file,
    });
  })
);

// Delete file
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validateIdParam,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await mediaService.deleteFile(id);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  })
);

// ============================================================================
// FILE STATISTICS AND ADMIN ROUTES
// ============================================================================

// Get file statistics (admin only)
router.get(
  "/admin/statistics",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const statistics = await mediaService.getFileStatistics();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  })
);

// Cleanup orphaned files (admin only)
router.post(
  "/admin/cleanup/orphaned",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await mediaService.cleanupOrphanedFiles();

    res.status(200).json({
      success: true,
      message: `${result.deleted} orphaned files cleaned up`,
      data: result,
    });
  })
);

// Cleanup old files (admin only)
router.post(
  "/admin/cleanup/old",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { daysOld = 30 } = req.body;

    const result = await mediaService.cleanupOldFiles(daysOld);

    res.status(200).json({
      success: true,
      message: `${result.deleted} old files cleaned up`,
      data: result,
    });
  })
);

// ============================================================================
// FILE URL GENERATION
// ============================================================================

// Generate file URLs
router.get(
  "/urls/:filename",
  asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;

    const urls = {
      original: mediaService.generateFileUrl(filename),
      thumbnail: mediaService.generateThumbnailUrl(filename),
      optimized: mediaService.generateOptimizedUrl(filename),
    };

    res.status(200).json({
      success: true,
      data: urls,
    });
  })
);

export default router;
