/*
  Warnings:

  - The primary key for the `StockManagement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `managementDate` on the `StockManagement` table. All the data in the column will be lost.
  - You are about to drop the column `managementId` on the `StockManagement` table. All the data in the column will be lost.
  - You are about to drop the column `managementType` on the `StockManagement` table. All the data in the column will be lost.
  - Added the required column `stockManagementType` to the `StockManagement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StockManagement" DROP CONSTRAINT "StockManagement_pkey",
DROP COLUMN "managementDate",
DROP COLUMN "managementId",
DROP COLUMN "managementType",
ADD COLUMN     "stockManagementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "stockManagementId" SERIAL NOT NULL,
ADD COLUMN     "stockManagementType" "ManagementType" NOT NULL,
ADD CONSTRAINT "StockManagement_pkey" PRIMARY KEY ("stockManagementId");
