/*
  Warnings:

  - Added the required column `updatedAt` to the `MemoriaProfiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isVerified` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemoriaProfiles" ADD COLUMN     "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL,
ADD COLUMN     "verificationToken" TEXT NOT NULL;
