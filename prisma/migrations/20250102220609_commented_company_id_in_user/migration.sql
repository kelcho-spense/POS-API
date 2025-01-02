/*
  Warnings:

  - You are about to drop the column `companyId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropIndex
DROP INDEX "idx_users_company";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "companyId";
