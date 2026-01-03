/*
  Warnings:

  - You are about to drop the column `image` on the `announcements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `announcements` DROP COLUMN `image`,
    ADD COLUMN `pinned` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `publishedAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX `announcements_pinned_idx` ON `announcements`(`pinned`);

-- CreateIndex
CREATE INDEX `announcements_publishedAt_idx` ON `announcements`(`publishedAt`);
