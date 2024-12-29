/*
  Warnings:

  - You are about to drop the `StockMovement` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ManagementType" AS ENUM ('ADDITION', 'SUBTRACTION', 'ADJUSTMENT');

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_performedById_fkey";

-- DropTable
DROP TABLE "StockMovement";

-- DropEnum
DROP TYPE "MovementType";

-- CreateTable
CREATE TABLE "StockManagement" (
    "managementId" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "managementType" "ManagementType" NOT NULL,
    "quantityChange" INTEGER NOT NULL,
    "reference" TEXT,
    "managementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "performedById" INTEGER,

    CONSTRAINT "StockManagement_pkey" PRIMARY KEY ("managementId")
);

-- CreateIndex
CREATE INDEX "idx_stock_managements_inventory" ON "StockManagement"("inventoryId");

-- AddForeignKey
ALTER TABLE "StockManagement" ADD CONSTRAINT "StockManagement_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("inventoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockManagement" ADD CONSTRAINT "StockManagement_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
