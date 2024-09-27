/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `birthday` on table `MemoriaProfiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deathday` on table `MemoriaProfiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profileId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_profileId_fkey";

-- AlterTable
ALTER TABLE "MemoriaProfiles" ALTER COLUMN "birthday" SET NOT NULL,
ALTER COLUMN "deathday" SET NOT NULL,
ALTER COLUMN "views" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "profileId" SET NOT NULL,
ALTER COLUMN "profileId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Profile";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "MemoriaProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
