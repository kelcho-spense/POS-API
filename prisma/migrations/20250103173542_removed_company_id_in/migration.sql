/*
  Warnings:

  - You are about to drop the column `companyId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Supplier` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_companyId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_companyId_fkey";

-- DropIndex
DROP INDEX "idx_inventory_company";

-- DropIndex
DROP INDEX "idx_products_company";

-- DropIndex
DROP INDEX "idx_purchase_orders_company";

-- DropIndex
DROP INDEX "idx_sales_company";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "companyId";
