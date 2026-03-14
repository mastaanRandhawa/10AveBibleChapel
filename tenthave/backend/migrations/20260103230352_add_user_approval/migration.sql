-- AlterTable
ALTER TABLE `users` ADD COLUMN `isApproved` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `users_isApproved_idx` ON `users`(`isApproved`);
