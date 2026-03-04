/*
  Warnings:

  - You are about to drop the column `email` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `content` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "email",
DROP COLUMN "message",
DROP COLUMN "subject",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "phone" SET NOT NULL;
