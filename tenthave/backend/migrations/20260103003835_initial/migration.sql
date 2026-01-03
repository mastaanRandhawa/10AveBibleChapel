-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MEMBER', 'GUEST') NOT NULL DEFAULT 'MEMBER',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calendar_events` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `isAllDay` BOOLEAN NOT NULL DEFAULT false,
    `recurrence` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'PUBLISHED',
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `link` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `calendar_events_startDate_idx`(`startDate`),
    INDEX `calendar_events_status_idx`(`status`),
    INDEX `calendar_events_isPublic_idx`(`isPublic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announcements` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `priority` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'PUBLISHED',
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `link` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `announcements_status_idx`(`status`),
    INDEX `announcements_isPublic_idx`(`isPublic`),
    INDEX `announcements_startDate_idx`(`startDate`),
    INDEX `announcements_endDate_idx`(`endDate`),
    INDEX `announcements_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prayer_requests` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `requester` VARCHAR(191) NULL,
    `category` ENUM('HEALTH', 'FAMILY', 'WORK', 'SPIRITUAL', 'COMMUNITY', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `priority` ENUM('URGENT', 'HIGH', 'NORMAL') NOT NULL DEFAULT 'NORMAL',
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'ANSWERED') NOT NULL DEFAULT 'PENDING',
    `isPrivate` BOOLEAN NOT NULL DEFAULT false,
    `isAnswered` BOOLEAN NOT NULL DEFAULT false,
    `answeredAt` DATETIME(3) NULL,
    `answerNotes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `prayer_requests_status_idx`(`status`),
    INDEX `prayer_requests_category_idx`(`category`),
    INDEX `prayer_requests_isPrivate_idx`(`isPrivate`),
    INDEX `prayer_requests_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
