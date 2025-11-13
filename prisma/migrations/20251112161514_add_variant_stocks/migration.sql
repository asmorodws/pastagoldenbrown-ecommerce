-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `variant` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `variantStocks` TEXT NULL;
