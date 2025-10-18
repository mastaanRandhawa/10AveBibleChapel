import { Router, Request, Response } from "express";
import { authService } from "@/services/auth.service";
import { authenticate, requireAdmin } from "@/middleware/auth.middleware";
import { asyncHandler } from "@/middleware/error.middleware";
import { validatePagination } from "@/middleware/validation.middleware";

const router = Router();

// ============================================================================
// ADMIN USER MANAGEMENT ROUTES
// ============================================================================

// Get all users (admin only)
router.get(
  "/",
  authenticate,
  requireAdmin,
  validatePagination,
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await authService.getAllUsers(page, limit, search);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  })
);

// Get user by ID (admin only)
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await authService.getProfile(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  })
);

// Update user role (admin only)
router.patch(
  "/:id/role",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    const user = await authService.updateUserRole(id, role);

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  })
);

// Deactivate user (admin only)
router.patch(
  "/:id/deactivate",
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await authService.deactivateUser(id);

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  })
);

export default router;
