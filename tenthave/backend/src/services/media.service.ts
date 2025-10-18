import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/config/database";
import { logger } from "@/config/logger";
import { config } from "@/config";
import { MediaFile, FileUploadResult, UploadConfig } from "@/types";
import { AppError } from "@/utils/errors";
import {
  getFileExtension,
  isImageFile,
  isDocumentFile,
  formatFileSize,
} from "@/utils/helpers";

export class MediaService {
  private uploadConfig: UploadConfig;

  constructor() {
    this.uploadConfig = {
      maxSize: config.upload.maxFileSize,
      allowedTypes: [
        ...config.upload.allowedImageTypes,
        ...config.upload.allowedDocumentTypes,
      ],
      destination: config.upload.dir,
    };
  }

  // ============================================================================
  // FILE UPLOAD CONFIGURATION
  // ============================================================================

  private createStorage() {
    return multer.diskStorage({
      destination: async (req, file, cb) => {
        try {
          const uploadPath = path.join(
            process.cwd(),
            this.uploadConfig.destination
          );
          await fs.mkdir(uploadPath, { recursive: true });
          cb(null, uploadPath);
        } catch (error) {
          cb(error as Error, "");
        }
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(
          file.originalname
        )}`;
        cb(null, uniqueName);
      },
    });
  }

  private createFileFilter() {
    return (
      req: any,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      if (this.uploadConfig.allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new AppError(`File type ${file.mimetype} is not allowed`, 400));
      }
    };
  }

  getUploadMiddleware() {
    return multer({
      storage: this.createStorage(),
      fileFilter: this.createFileFilter(),
      limits: {
        fileSize: this.uploadConfig.maxSize,
        files: 10, // Maximum 10 files per request
      },
    });
  }

  // ============================================================================
  // FILE PROCESSING
  // ============================================================================

  private async processImage(file: Express.Multer.File): Promise<{
    originalPath: string;
    thumbnailPath?: string;
    optimizedPath?: string;
  }> {
    const filePath = path.join(
      process.cwd(),
      this.uploadConfig.destination,
      file.filename
    );
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(file.filename, path.extname(file.filename));
    const fileExt = path.extname(file.filename);

    const results: any = {
      originalPath: filePath,
    };

    try {
      // Create thumbnail (300x300)
      const thumbnailPath = path.join(fileDir, `${fileName}-thumb${fileExt}`);
      await sharp(filePath)
        .resize(300, 300, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      results.thumbnailPath = thumbnailPath;

      // Create optimized version (max 1920px width)
      const optimizedPath = path.join(
        fileDir,
        `${fileName}-optimized${fileExt}`
      );
      await sharp(filePath)
        .resize(1920, null, { withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      results.optimizedPath = optimizedPath;

      logger.info(`Image processed: ${file.filename}`);
    } catch (error) {
      logger.error("Image processing error:", error);
      // Don't throw error, just log it
    }

    return results;
  }

  private async processDocument(file: Express.Multer.File): Promise<{
    originalPath: string;
  }> {
    const filePath = path.join(
      process.cwd(),
      this.uploadConfig.destination,
      file.filename
    );

    return {
      originalPath: filePath,
    };
  }

  // ============================================================================
  // FILE UPLOAD
  // ============================================================================

  async uploadFile(
    file: Express.Multer.File,
    entityType?: string,
    entityId?: string
  ): Promise<FileUploadResult> {
    try {
      if (!file) {
        throw new AppError("No file provided", 400);
      }

      // Check file size
      if (file.size > this.uploadConfig.maxSize) {
        throw new AppError(
          `File size exceeds maximum allowed size (${formatFileSize(
            this.uploadConfig.maxSize
          )})`,
          413
        );
      }

      // Check file type
      if (!this.uploadConfig.allowedTypes.includes(file.mimetype)) {
        throw new AppError(`File type ${file.mimetype} is not allowed`, 400);
      }

      // Process file based on type
      let processedFiles: any = {};

      if (isImageFile(file.mimetype)) {
        processedFiles = await this.processImage(file);
      } else if (isDocumentFile(file.mimetype)) {
        processedFiles = await this.processDocument(file);
      }

      // Save file metadata to database
      const mediaFile = await prisma.mediaFile.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: processedFiles.originalPath,
          entityType,
          entityId,
        },
      });

      // Generate URL for the file
      const baseUrl = config.cors.origin;
      const fileUrl = `${baseUrl}/uploads/${file.filename}`;

      logger.info(`File uploaded successfully: ${file.filename}`);

      return {
        id: mediaFile.id,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: processedFiles.originalPath,
        url: fileUrl,
      };
    } catch (error) {
      logger.error("File upload error:", error);
      throw error;
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    entityType?: string,
    entityId?: string
  ): Promise<FileUploadResult[]> {
    try {
      const results: FileUploadResult[] = [];

      for (const file of files) {
        const result = await this.uploadFile(file, entityType, entityId);
        results.push(result);
      }

      logger.info(`Multiple files uploaded: ${files.length} files`);
      return results;
    } catch (error) {
      logger.error("Multiple file upload error:", error);
      throw error;
    }
  }

  // ============================================================================
  // FILE MANAGEMENT
  // ============================================================================

  async getFileById(id: string): Promise<MediaFile> {
    try {
      const file = await prisma.mediaFile.findUnique({
        where: { id },
      });

      if (!file) {
        throw new AppError("File not found", 404);
      }

      return file;
    } catch (error) {
      logger.error("Get file by ID error:", error);
      throw error;
    }
  }

  async getFilesByEntity(
    entityType: string,
    entityId: string
  ): Promise<MediaFile[]> {
    try {
      const files = await prisma.mediaFile.findMany({
        where: {
          entityType,
          entityId,
        },
        orderBy: { createdAt: "desc" },
      });

      return files;
    } catch (error) {
      logger.error("Get files by entity error:", error);
      throw error;
    }
  }

  async deleteFile(id: string): Promise<void> {
    try {
      const file = await prisma.mediaFile.findUnique({
        where: { id },
      });

      if (!file) {
        throw new AppError("File not found", 404);
      }

      // Delete physical files
      try {
        await fs.unlink(file.path);

        // Delete thumbnail and optimized versions if they exist
        const fileDir = path.dirname(file.path);
        const fileName = path.basename(
          file.filename,
          path.extname(file.filename)
        );
        const fileExt = path.extname(file.filename);

        const thumbnailPath = path.join(fileDir, `${fileName}-thumb${fileExt}`);
        const optimizedPath = path.join(
          fileDir,
          `${fileName}-optimized${fileExt}`
        );

        try {
          await fs.unlink(thumbnailPath);
        } catch (error) {
          // Thumbnail might not exist
        }

        try {
          await fs.unlink(optimizedPath);
        } catch (error) {
          // Optimized version might not exist
        }
      } catch (error) {
        logger.warn("Failed to delete physical file:", error);
        // Continue with database deletion even if physical file deletion fails
      }

      // Delete database record
      await prisma.mediaFile.delete({
        where: { id },
      });

      logger.info(`File deleted: ${file.filename}`);
    } catch (error) {
      logger.error("Delete file error:", error);
      throw error;
    }
  }

  async updateFileMetadata(
    id: string,
    data: {
      entityType?: string;
      entityId?: string;
    }
  ): Promise<MediaFile> {
    try {
      const file = await prisma.mediaFile.update({
        where: { id },
        data,
      });

      logger.info(`File metadata updated: ${id}`);
      return file;
    } catch (error) {
      logger.error("Update file metadata error:", error);
      throw error;
    }
  }

  // ============================================================================
  // FILE STATISTICS
  // ============================================================================

  async getFileStatistics(): Promise<{
    total: number;
    totalSize: number;
    byType: Record<string, number>;
    byEntity: Record<string, number>;
  }> {
    try {
      const [total, files, byType, byEntity] = await Promise.all([
        prisma.mediaFile.count(),
        prisma.mediaFile.findMany({
          select: { size: true },
        }),
        prisma.mediaFile.groupBy({
          by: ["mimeType"],
          _count: { mimeType: true },
        }),
        prisma.mediaFile.groupBy({
          by: ["entityType"],
          _count: { entityType: true },
        }),
      ]);

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      return {
        total,
        totalSize,
        byType: byType.reduce((acc, item) => {
          acc[item.mimeType] = item._count.mimeType;
          return acc;
        }, {} as Record<string, number>),
        byEntity: byEntity.reduce((acc, item) => {
          acc[item.entityType || "Unassigned"] = item._count.entityType;
          return acc;
        }, {} as Record<string, number>),
      };
    } catch (error) {
      logger.error("Get file statistics error:", error);
      throw error;
    }
  }

  // ============================================================================
  // CLEANUP OPERATIONS
  // ============================================================================

  async cleanupOrphanedFiles(): Promise<{ deleted: number }> {
    try {
      // Find files that are not associated with any entity
      const orphanedFiles = await prisma.mediaFile.findMany({
        where: {
          OR: [
            { entityType: null },
            { entityId: null },
            { entityType: "" },
            { entityId: "" },
          ],
        },
      });

      let deletedCount = 0;

      for (const file of orphanedFiles) {
        try {
          await this.deleteFile(file.id);
          deletedCount++;
        } catch (error) {
          logger.warn(`Failed to delete orphaned file ${file.id}:`, error);
        }
      }

      logger.info(`Cleaned up ${deletedCount} orphaned files`);
      return { deleted: deletedCount };
    } catch (error) {
      logger.error("Cleanup orphaned files error:", error);
      throw error;
    }
  }

  async cleanupOldFiles(daysOld: number = 30): Promise<{ deleted: number }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const oldFiles = await prisma.mediaFile.findMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
          entityType: null, // Only delete unassigned files
          entityId: null,
        },
      });

      let deletedCount = 0;

      for (const file of oldFiles) {
        try {
          await this.deleteFile(file.id);
          deletedCount++;
        } catch (error) {
          logger.warn(`Failed to delete old file ${file.id}:`, error);
        }
      }

      logger.info(`Cleaned up ${deletedCount} old files`);
      return { deleted: deletedCount };
    } catch (error) {
      logger.error("Cleanup old files error:", error);
      throw error;
    }
  }

  // ============================================================================
  // FILE VALIDATION
  // ============================================================================

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new AppError("No file provided", 400);
    }

    if (file.size > this.uploadConfig.maxSize) {
      throw new AppError(
        `File size exceeds maximum allowed size (${formatFileSize(
          this.uploadConfig.maxSize
        )})`,
        413
      );
    }

    if (!this.uploadConfig.allowedTypes.includes(file.mimetype)) {
      throw new AppError(`File type ${file.mimetype} is not allowed`, 400);
    }
  }

  // ============================================================================
  // FILE URL GENERATION
  // ============================================================================

  generateFileUrl(filename: string): string {
    const baseUrl = config.cors.origin;
    return `${baseUrl}/uploads/${filename}`;
  }

  generateThumbnailUrl(filename: string): string {
    const baseUrl = config.cors.origin;
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    const ext = path.extname(filename);
    return `${baseUrl}/uploads/${nameWithoutExt}-thumb${ext}`;
  }

  generateOptimizedUrl(filename: string): string {
    const baseUrl = config.cors.origin;
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    const ext = path.extname(filename);
    return `${baseUrl}/uploads/${nameWithoutExt}-optimized${ext}`;
  }
}

export const mediaService = new MediaService();
