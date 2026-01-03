-- CreateTable
CREATE TABLE `sermons` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `speaker` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `passage` VARCHAR(191) NULL,
    `series` VARCHAR(191) NULL,
    `videoUrl` VARCHAR(191) NULL,
    `audioUrl` VARCHAR(191) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'PUBLISHED',
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `sermons_status_idx`(`status`),
    INDEX `sermons_isPublic_idx`(`isPublic`),
    INDEX `sermons_isFeatured_idx`(`isFeatured`),
    INDEX `sermons_date_idx`(`date`),
    INDEX `sermons_series_idx`(`series`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
