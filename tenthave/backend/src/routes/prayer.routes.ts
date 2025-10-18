import { Router } from "express";
import { prayerController } from "@/controllers/prayer.controller";
import {
  authenticate,
  requireAdmin,
  requireMember,
  optionalAuth,
  prayerRequestRateLimit,
} from "@/middleware/auth.middleware";
import {
  validatePrayerRequestCreate,
  validatePrayerRequestUpdate,
  validatePrayerRequestFilters,
  validateBulkOperation,
  validatePagination,
} from "@/middleware/validation.middleware";

/**
 * @swagger
 * components:
 *   schemas:
 *     PrayerRequestCreate:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - requester
 *       properties:
 *         title:
 *           type: string
 *           example: Prayer for healing
 *         description:
 *           type: string
 *           example: Please pray for my recovery from illness
 *         requester:
 *           type: string
 *           example: John Doe
 *         category:
 *           type: string
 *           enum: [health, family, work, spiritual, other]
 *           example: health
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *           example: medium
 *         isPrivate:
 *           type: boolean
 *           example: false
 *
 *     PrayerRequestUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Updated prayer request title
 *         description:
 *           type: string
 *           example: Updated description
 *         requester:
 *           type: string
 *           example: John Doe
 *         category:
 *           type: string
 *           enum: [health, family, work, spiritual, other]
 *           example: health
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *           example: high
 *         isPrivate:
 *           type: boolean
 *           example: true
 *         answerNotes:
 *           type: string
 *           example: Prayer has been answered
 *
 *     PrayerRequestFilters:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected, answered]
 *           example: approved
 *         category:
 *           type: string
 *           enum: [health, family, work, spiritual, other]
 *           example: health
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *           example: high
 *         isPrivate:
 *           type: boolean
 *           example: false
 *         isAnswered:
 *           type: boolean
 *           example: false
 *         requester:
 *           type: string
 *           example: John
 *         dateFrom:
 *           type: string
 *           format: date
 *           example: 2023-01-01
 *         dateTo:
 *           type: string
 *           format: date
 *           example: 2023-12-31
 *
 *     PrayerRequestResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/PrayerRequest'
 *         - type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: Prayer request retrieved successfully
 *
 *     PrayerRequestListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PrayerRequest'
 *         meta:
 *           $ref: '#/components/schemas/PaginationMeta'
 */

const router = Router();

// ============================================================================
// PUBLIC ROUTES (with optional authentication)
// ============================================================================

/**
 * @swagger
 * /api/v1/prayer-requests:
 *   get:
 *     summary: Get prayer requests
 *     tags: [Prayer Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, answered]
 *         description: Filter by status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [health, family, work, spiritual, other]
 *         description: Filter by category
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         description: Filter by priority
 *       - in: query
 *         name: isPrivate
 *         schema:
 *           type: boolean
 *         description: Filter by privacy setting
 *       - in: query
 *         name: isAnswered
 *         schema:
 *           type: boolean
 *         description: Filter by answered status
 *       - in: query
 *         name: requester
 *         schema:
 *           type: string
 *         description: Filter by requester name
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date
 *     responses:
 *       200:
 *         description: Prayer requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrayerRequestListResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/",
  optionalAuth,
  validatePagination,
  validatePrayerRequestFilters,
  prayerController.getPrayerRequests
);

/**
 * @swagger
 * /api/v1/prayer-requests/{id}:
 *   get:
 *     summary: Get prayer request by ID
 *     tags: [Prayer Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Prayer request ID
 *     responses:
 *       200:
 *         description: Prayer request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrayerRequestResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Prayer request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", optionalAuth, prayerController.getPrayerRequestById);

/**
 * @swagger
 * /api/v1/prayer-requests:
 *   post:
 *     summary: Submit prayer request
 *     tags: [Prayer Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrayerRequestCreate'
 *     responses:
 *       201:
 *         description: Prayer request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Prayer request submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/PrayerRequest'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/",
  prayerRequestRateLimit,
  validatePrayerRequestCreate,
  prayerController.createPrayerRequest
);

// ============================================================================
// AUTHENTICATED ROUTES
// ============================================================================

// Update own prayer request
router.put(
  "/:id",
  authenticate,
  validatePrayerRequestUpdate,
  prayerController.updatePrayerRequest
);

// Delete own prayer request
router.delete("/:id", authenticate, prayerController.deletePrayerRequest);

// ============================================================================
// ADMIN ROUTES
// ============================================================================

// Approve prayer request
router.patch(
  "/:id/approve",
  authenticate,
  requireAdmin,
  prayerController.approvePrayerRequest
);

// Reject prayer request
router.patch(
  "/:id/reject",
  authenticate,
  requireAdmin,
  prayerController.rejectPrayerRequest
);

// Mark prayer as answered
router.patch(
  "/:id/answered",
  authenticate,
  requireAdmin,
  prayerController.markPrayerAsAnswered
);

// Grant prayer permission
router.post(
  "/:id/permissions",
  authenticate,
  requireAdmin,
  prayerController.grantPrayerPermission
);

// Revoke prayer permission
router.delete(
  "/:id/permissions",
  authenticate,
  requireAdmin,
  prayerController.revokePrayerPermission
);

// Get prayer statistics
router.get(
  "/admin/statistics",
  authenticate,
  requireAdmin,
  prayerController.getPrayerStatistics
);

// Bulk update prayer requests
router.patch(
  "/bulk/update",
  authenticate,
  requireAdmin,
  validateBulkOperation,
  prayerController.bulkUpdatePrayerRequests
);

// Bulk delete prayer requests
router.delete(
  "/bulk/delete",
  authenticate,
  requireAdmin,
  validateBulkOperation,
  prayerController.bulkDeletePrayerRequests
);

export default router;
