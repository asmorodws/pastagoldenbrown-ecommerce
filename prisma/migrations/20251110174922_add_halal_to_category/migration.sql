-- AlterTable
ALTER TABLE `Category` ADD COLUMN `halal` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NULL DEFAULT 'bank_transfer',
    ADD COLUMN `shippingPhone` VARCHAR(191) NULL,
    ADD COLUMN `shippingProvince` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `discount` DECIMAL(5, 2) NULL,
    ADD COLUMN `discountPrice` DECIMAL(10, 2) NULL;
