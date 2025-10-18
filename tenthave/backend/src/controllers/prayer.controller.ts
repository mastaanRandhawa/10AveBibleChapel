import { Request, Response, NextFunction } from "express";
import { prayerService } from "@/services/prayer.service";
import { logger } from "@/config/logger";
import { AuthRequest, PrayerRequestFilters, PaginationQuery } from "@/types";
import { asyncHandler } from "@/middleware/error.middleware";

export class PrayerController {
  // ============================================================================
  // CREATE PRAYER REQUEST
  // ============================================================================

  createPrayerRequest = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const prayerData = req.body;
      const userId = req.user?.id; // Optional for anonymous requests

      const prayerRequest = await prayerService.createPrayerRequest(
        prayerData,
        userId
      );

      res.status(201).json({
        success: true,
        message: "Prayer request submitted successfully",
        data: prayerRequest,
      });
    }
  );

  // ============================================================================
  // GET PRAYER REQUESTS
  // ============================================================================

  getPrayerRequests = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const filters: PrayerRequestFilters = {
        status: req.query.status
          ? Array.isArray(req.query.status)
            ? (req.query.status as any[])
            : [req.query.status as any]
          : undefined,
        category: req.query.category
          ? Array.isArray(req.query.category)
            ? (req.query.category as any[])
            : [req.query.category as any]
          : undefined,
        priority: req.query.priority
          ? Array.isArray(req.query.priority)
            ? (req.query.priority as any[])
            : [req.query.priority as any]
          : undefined,
        isPrivate: req.query.isPrivate
          ? req.query.isPrivate === "true"
          : undefined,
        isAnswered: req.query.isAnswered
          ? req.query.isAnswered === "true"
          : undefined,
        userId: req.query.userId as string,
        dateFrom: req.query.dateFrom
          ? new Date(req.query.dateFrom as string)
          : undefined,
        dateTo: req.query.dateTo
          ? new Date(req.query.dateTo as string)
          : undefined,
      };

      const pagination: PaginationQuery = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as "asc" | "desc",
      };

      const currentUser = req.user
        ? {
            id: req.user.id,
            role: req.user.role,
          }
        : undefined;

      const result = await prayerService.getPrayerRequests(
        filters,
        pagination,
        currentUser
      );

      res.status(200).json({
        success: true,
        data: result.prayerRequests,
        pagination: result.pagination,
      });
    }
  );

  // ============================================================================
  // GET PRAYER REQUEST BY ID
  // ============================================================================

  getPrayerRequestById = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;

      const currentUser = req.user
        ? {
            id: req.user.id,
            role: req.user.role,
          }
        : undefined;

      const prayerRequest = await prayerService.getPrayerRequestById(
        id,
        currentUser
      );

      res.status(200).json({
        success: true,
        data: prayerRequest,
      });
    }
  );

  // ============================================================================
  // UPDATE PRAYER REQUEST
  // ============================================================================

  updatePrayerRequest = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const updateData = req.body;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const prayerRequest = await prayerService.updatePrayerRequest(
        id,
        updateData,
        {
          id: req.user!.id,
          role: req.user!.role,
        }
      );

      res.status(200).json({
        success: true,
        message: "Prayer request updated successfully",
        data: prayerRequest,
      });
    }
  );

  // ============================================================================
  // DELETE PRAYER REQUEST
  // ============================================================================

  deletePrayerRequest = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      await prayerService.deletePrayerRequest(id, {
        id: req.user!.id,
        role: req.user!.role,
      });

      res.status(200).json({
        success: true,
        message: "Prayer request deleted successfully",
      });
    }
  );

  // ============================================================================
  // ADMIN OPERATIONS
  // ============================================================================

  approvePrayerRequest = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;

      const prayerRequest = await prayerService.approvePrayerRequest(id);

      res.status(200).json({
        success: true,
        message: "Prayer request approved successfully",
        data: prayerRequest,
      });
    }
  );

  rejectPrayerRequest = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;

      const prayerRequest = await prayerService.rejectPrayerRequest(id);

      res.status(200).json({
        success: true,
        message: "Prayer request rejected successfully",
        data: prayerRequest,
      });
    }
  );

  markPrayerAsAnswered = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const { answerNotes } = req.body;

      const prayerRequest = await prayerService.markPrayerAsAnswered(
        id,
        answerNotes
      );

      res.status(200).json({
        success: true,
        message: "Prayer request marked as answered",
        data: prayerRequest,
      });
    }
  );

  // ============================================================================
  // PRAYER PERMISSIONS
  // ============================================================================

  grantPrayerPermission = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const { userId } = req.body;

      await prayerService.grantPrayerPermission(id, userId);

      res.status(200).json({
        success: true,
        message: "Prayer permission granted successfully",
      });
    }
  );

  revokePrayerPermission = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const { userId } = req.body;

      await prayerService.revokePrayerPermission(id, userId);

      res.status(200).json({
        success: true,
        message: "Prayer permission revoked successfully",
      });
    }
  );

  // ============================================================================
  // STATISTICS
  // ============================================================================

  getPrayerStatistics = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const statistics = await prayerService.getPrayerStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
      });
    }
  );

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  bulkUpdatePrayerRequests = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { ids, data } = req.body;

      const result = await prayerService.bulkUpdatePrayerRequests(ids, data);

      res.status(200).json({
        success: true,
        message: `${result.count} prayer requests updated successfully`,
        data: result,
      });
    }
  );

  bulkDeletePrayerRequests = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { ids } = req.body;

      const result = await prayerService.bulkDeletePrayerRequests(ids);

      res.status(200).json({
        success: true,
        message: `${result.count} prayer requests deleted successfully`,
        data: result,
      });
    }
  );
}

export const prayerController = new PrayerController();
