-- DropIndex
DROP INDEX `prayer_requests_status_idx` ON `prayer_requests`;

-- DropIndex
DROP INDEX `prayer_requests_category_idx` ON `prayer_requests`;

-- AlterTable
ALTER TABLE `prayer_requests` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `prayer_requests` DROP COLUMN `category`;

-- AlterTable
ALTER TABLE `prayer_requests` DROP COLUMN `priority`;
