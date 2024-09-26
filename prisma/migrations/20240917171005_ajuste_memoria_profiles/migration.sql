/*
  Warnings:

  - Added the required column `profileImg` to the `MemoriaProfiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemoriaProfiles" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "profileImg" TEXT NOT NULL;
