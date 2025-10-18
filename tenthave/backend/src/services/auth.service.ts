import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRole } from "@prisma/client";
import { prisma } from "@/config/database";
import { config } from "@/config";
import { logger } from "@/config/logger";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserCreateData,
  JWTPayload,
  PasswordResetRequest,
  PasswordResetConfirm,
} from "@/types";
import {
  generateSecureToken,
  hashToken,
  isValidEmail,
  isValidPassword,
} from "@/utils/helpers";
import { AppError } from "@/utils/errors";
import { emailService } from "./email.service";

export class AuthService {
  // ============================================================================
  // USER REGISTRATION
  // ============================================================================

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Validate email format
      if (!isValidEmail(data.email)) {
        throw new AppError("Please provide a valid email address", 400);
      }

      // Validate password strength
      if (!isValidPassword(data.password)) {
        throw new AppError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
          400
        );
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (existingUser) {
        throw new AppError("User with this email already exists", 409);
      }

      // Hash password
      const passwordHash = await bcrypt.hash(
        data.password,
        config.security.bcryptRounds
      );

      // Create user
      const userData: any = {
        email: data.email.toLowerCase(),
        passwordHash: passwordHash,
        name: data.name,
        role: UserRole.GUEST, // Default role
        phone: data.phone,
        address: data.address,
      };

      const user = await prisma.user.create({
        data: userData,
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

      // Generate tokens
      const { token, refreshToken, expiresAt } = this.generateTokens(
        user as any
      );

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user.email, user.name);
      } catch (emailError) {
        logger.warn("Failed to send welcome email:", emailError);
      }

      logger.info(`New user registered: ${user.email}`);

      return {
        user,
        token,
        refreshToken,
        expiresAt,
      };
    } catch (error) {
      logger.error("Registration error:", error);
      throw error;
    }
  }

  // ============================================================================
  // USER LOGIN
  // ============================================================================

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        throw new AppError("Invalid email or password", 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError(
          "Account is deactivated. Please contact support.",
          403
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Generate tokens
      const { token, refreshToken, expiresAt } = this.generateTokens(
        user as any
      );

      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = user;

      logger.info(`User logged in: ${user.email}`);

      return {
        user: userWithoutPassword,
        token,
        refreshToken,
        expiresAt,
      };
    } catch (error) {
      logger.error("Login error:", error);
      throw error;
    }
  }

  // ============================================================================
  // TOKEN GENERATION
  // ============================================================================

  private generateTokens(user: User): {
    token: string;
    refreshToken: string;
    expiresAt: Date;
  } {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as any);

    const refreshToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as any);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    return { token, refreshToken, expiresAt };
  }

  // ============================================================================
  // TOKEN VERIFICATION
  // ============================================================================

  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, isActive: true, role: true },
      });

      if (!user || !user.isActive) {
        throw new AppError("Invalid token - user not found or inactive", 401);
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError("Invalid token", 401);
      }
      throw error;
    }
  }

  // ============================================================================
  // PASSWORD RESET
  // ============================================================================

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    try {
      const { email } = data;

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        // Don't reveal if user exists or not
        return;
      }

      // Generate reset token
      const resetToken = generateSecureToken();
      const hashedToken = hashToken(resetToken);
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry

      // Save reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: resetExpires,
        },
      });

      // Send reset email
      await emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken
      );

      logger.info(`Password reset requested for: ${user.email}`);
    } catch (error) {
      logger.error("Password reset request error:", error);
      throw error;
    }
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    try {
      const { token, password } = data;

      // Validate password strength
      if (!isValidPassword(password)) {
        throw new AppError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
          400
        );
      }

      const hashedToken = hashToken(token);

      // Find user with valid reset token
      const user = await prisma.user.findFirst({
        where: {
          passwordResetToken: hashedToken,
          passwordResetExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        throw new AppError("Invalid or expired reset token", 400);
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(
        password,
        config.security.bcryptRounds
      );

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      logger.info(`Password reset completed for: ${user.email}`);
    } catch (error) {
      logger.error("Password reset confirmation error:", error);
      throw error;
    }
  }

  // ============================================================================
  // EMAIL VERIFICATION
  // ============================================================================

  async requestEmailVerification(userId: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (user.isEmailVerified) {
        throw new AppError("Email is already verified", 400);
      }

      // Generate verification token
      const verificationToken = generateSecureToken();
      const hashedToken = hashToken(verificationToken);

      // Save verification token
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerificationToken: hashedToken },
      });

      // Send verification email
      await emailService.sendEmailVerification(
        user.email,
        user.name,
        verificationToken
      );

      logger.info(`Email verification requested for: ${user.email}`);
    } catch (error) {
      logger.error("Email verification request error:", error);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const hashedToken = hashToken(token);

      const user = await prisma.user.findFirst({
        where: { emailVerificationToken: hashedToken },
      });

      if (!user) {
        throw new AppError("Invalid verification token", 400);
      }

      // Mark email as verified and clear token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null,
        },
      });

      logger.info(`Email verified for: ${user.email}`);
    } catch (error) {
      logger.error("Email verification error:", error);
      throw error;
    }
  }

  // ============================================================================
  // USER PROFILE MANAGEMENT
  // ============================================================================

  async getProfile(userId: string): Promise<Omit<User, "passwordHash">> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        memberSince: user.memberSince,
        lastLoginAt: user.lastLoginAt,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as any;
    } catch (error) {
      logger.error("Get profile error:", error);
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    updateData: Partial<User>
  ): Promise<Omit<User, "passwordHash">> {
    try {
      const { passwordHash, ...allowedUpdates } = updateData;

      const user = await prisma.user.update({
        where: { id: userId },
        data: allowedUpdates,
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

      logger.info(`Profile updated for user: ${user.email}`);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        memberSince: user.memberSince,
        lastLoginAt: user.lastLoginAt,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as any;
    } catch (error) {
      logger.error("Update profile error:", error);
      throw error;
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Validate new password strength
      if (!isValidPassword(newPassword)) {
        throw new AppError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
          400
        );
      }

      // Get user with password hash
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );
      if (!isCurrentPasswordValid) {
        throw new AppError("Current password is incorrect", 400);
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(
        newPassword,
        config.security.bcryptRounds
      );

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      });

      logger.info(`Password changed for user: ${user.email}`);
    } catch (error) {
      logger.error("Change password error:", error);
      throw error;
    }
  }

  // ============================================================================
  // ADMIN USER MANAGEMENT
  // ============================================================================

  async getAllUsers(page: number = 1, limit: number = 10, search?: string) {
    try {
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
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
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error("Get all users error:", error);
      throw error;
    }
  }

  async updateUserRole(
    userId: string,
    role: UserRole
  ): Promise<Omit<User, "passwordHash">> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
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

      logger.info(`User role updated for: ${user.email} to ${role}`);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        memberSince: user.memberSince,
        lastLoginAt: user.lastLoginAt,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as any;
    } catch (error) {
      logger.error("Update user role error:", error);
      throw error;
    }
  }

  async deactivateUser(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      });

      logger.info(`User deactivated: ${userId}`);
    } catch (error) {
      logger.error("Deactivate user error:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
