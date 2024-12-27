-- AlterTable
ALTER TABLE "User" ADD COLUMN     "access_token_hash" TEXT,
ADD COLUMN     "refresh_token_hash" TEXT;
