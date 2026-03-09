-- CreateTable
CREATE TABLE "StoreConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "freeShippingThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreConfig_pkey" PRIMARY KEY ("id")
);
