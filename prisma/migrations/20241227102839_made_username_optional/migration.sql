/*
  Warnings:

  - Made the column `fullName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "fullName" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;
