import { Request, Response, NextFunction } from "express";
import { authService } from "@/services/auth.service";
import { logger } from "@/config/logger";
import { AuthRequest, LoginCredentials, RegisterData } from "@/types";
import { asyncHandler } from "@/middleware/error.middleware";

export class AuthController {
  // ============================================================================
  // USER REGISTRATION
  // ============================================================================

  register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const userData: RegisterData = req.body;

      const result = await authService.register(userData);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    }
  );

  // ============================================================================
  // USER LOGIN
  // ============================================================================

  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const credentials: LoginCredentials = req.body;

      const result = await authService.login(credentials);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    }
  );

  // ============================================================================
  // GET CURRENT USER PROFILE
  // ============================================================================

  getProfile = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const userId = req.user!.id;

      const profile = await authService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    }
  );

  // ============================================================================
  // UPDATE USER PROFILE
  // ============================================================================

  updateProfile = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const updateData = req.body;

      const profile = await authService.updateProfile(userId, updateData);

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    }
  );

  // ============================================================================
  // CHANGE PASSWORD
  // ============================================================================

  changePassword = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    }
  );

  // ============================================================================
  // REQUEST PASSWORD RESET
  // ============================================================================

  requestPasswordReset = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email } = req.body;

      await authService.requestPasswordReset({ email });

      res.status(200).json({
        success: true,
        message: "Password reset email sent if account exists",
      });
    }
  );

  // ============================================================================
  // CONFIRM PASSWORD RESET
  // ============================================================================

  confirmPasswordReset = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { token, password } = req.body;

      await authService.confirmPasswordReset({ token, password });

      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    }
  );

  // ============================================================================
  // REQUEST EMAIL VERIFICATION
  // ============================================================================

  requestEmailVerification = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const userId = req.user!.id;

      await authService.requestEmailVerification(userId);

      res.status(200).json({
        success: true,
        message: "Email verification sent",
      });
    }
  );

  // ============================================================================
  // VERIFY EMAIL
  // ============================================================================

  verifyEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { token } = req.body;

      await authService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    }
  );

  // ============================================================================
  // LOGOUT (CLIENT-SIDE TOKEN REMOVAL)
  // ============================================================================

  logout = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      // In a JWT-based system, logout is typically handled client-side
      // by removing the token from storage. However, we can log the logout event.

      if (req.user) {
        logger.info(`User logged out: ${req.user.email}`);
      }

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    }
  );

  // ============================================================================
  // REFRESH TOKEN
  // ============================================================================

  refreshToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: "Refresh token required",
        });
      }

      // Verify refresh token and generate new access token
      const decoded = await authService.verifyToken(refreshToken);

      // Get user from database
      const { prisma } = await import("@/config/database");
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          address: true,
          dateOfBirth: true,
          memberSince: true,
          lastLoginAt: true,
          isEmailVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      // Generate new tokens
      const {
        token,
        refreshToken: newRefreshToken,
        expiresAt,
      } = authService["generateTokens"](user as any);

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          user,
          token,
          refreshToken: newRefreshToken,
          expiresAt,
        },
      });
    }
  );
}

export const authController = new AuthController();
