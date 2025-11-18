/*
  Warnings:

  - You are about to drop the column `variant` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `variantStocks` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `variants` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,productVariantId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderCode]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderCode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CartItem` DROP FOREIGN KEY `CartItem_userId_fkey`;

-- DropIndex
DROP INDEX `CartItem_userId_productId_key` ON `CartItem`;

-- AlterTable
ALTER TABLE `CartItem` ADD COLUMN `productVariantId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `courier` VARCHAR(191) NULL,
    ADD COLUMN `courierService` VARCHAR(191) NULL,
    ADD COLUMN `orderCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `paidAt` DATETIME(3) NULL,
    ADD COLUMN `paymentProof` VARCHAR(191) NULL,
    ADD COLUMN `shippingCost` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `subtotal` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `trackingNumber` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'PAYMENT_UPLOADED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `variant`,
    ADD COLUMN `productVariantId` VARCHAR(191) NULL,
    ADD COLUMN `variantName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `stock`,
    DROP COLUMN `variantStocks`,
    DROP COLUMN `variants`;

-- CreateTable
CREATE TABLE `ProductVariant` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NULL,
    `sku` VARCHAR(191) NULL,
    `price` DECIMAL(10, 2) NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `image` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductVariant_productId_idx`(`productId`),
    UNIQUE INDEX `ProductVariant_productId_name_key`(`productId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Settings_key_key`(`key`),
    INDEX `Settings_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiCache` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `endpoint` VARCHAR(191) NOT NULL,
    `params` TEXT NULL,
    `response` JSON NOT NULL,
    `ttl` INTEGER NOT NULL DEFAULT 3600,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ApiCache_key_key`(`key`),
    INDEX `ApiCache_endpoint_idx`(`endpoint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `CartItem_userId_idx` ON `CartItem`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `CartItem_userId_productVariantId_key` ON `CartItem`(`userId`, `productVariantId`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_orderCode_key` ON `Order`(`orderCode`);

-- CreateIndex
CREATE INDEX `Order_orderCode_idx` ON `Order`(`orderCode`);

-- CreateIndex
CREATE INDEX `Order_status_idx` ON `Order`(`status`);

-- AddForeignKey (Skip if already exists)
-- ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductVariant` ADD CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productVariantId_fkey` FOREIGN KEY (`productVariantId`) REFERENCES `ProductVariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productVariantId_fkey` FOREIGN KEY (`productVariantId`) REFERENCES `ProductVariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `CartItem` RENAME INDEX `CartItem_productId_fkey` TO `CartItem_productId_idx`;

-- RenameIndex
ALTER TABLE `Order` RENAME INDEX `Order_userId_fkey` TO `Order_userId_idx`;

-- RenameIndex
ALTER TABLE `OrderItem` RENAME INDEX `OrderItem_orderId_fkey` TO `OrderItem_orderId_idx`;

-- RenameIndex
ALTER TABLE `OrderItem` RENAME INDEX `OrderItem_productId_fkey` TO `OrderItem_productId_idx`;
