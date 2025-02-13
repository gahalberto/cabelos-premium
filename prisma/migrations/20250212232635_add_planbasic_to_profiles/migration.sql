-- CreateEnum
CREATE TYPE "Plano" AS ENUM ('Basic', 'Premium');

-- AlterTable
ALTER TABLE "MemoriaProfiles" ADD COLUMN     "plan" "Plano" NOT NULL DEFAULT 'Basic';
