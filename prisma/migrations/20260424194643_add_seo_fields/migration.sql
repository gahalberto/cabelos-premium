-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "keywords" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "noIndex" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "keywords" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "ogImage" TEXT;

-- AlterTable
ALTER TABLE "StoreConfig" ADD COLUMN     "customBodyScripts" TEXT,
ADD COLUMN     "customHeadScripts" TEXT,
ADD COLUMN     "ga4Id" TEXT,
ADD COLUMN     "gtmId" TEXT,
ADD COLUMN     "metaPixelId" TEXT,
ADD COLUMN     "robotsContent" TEXT;

-- CreateTable
CREATE TABLE "SEOConfig" (
    "id" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "keywords" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SEOConfig_pkey" PRIMARY KEY ("id")
);
