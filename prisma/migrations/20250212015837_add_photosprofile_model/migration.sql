-- CreateTable
CREATE TABLE "ProfilePhotos" (
    "id" SERIAL NOT NULL,
    "profileId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfilePhotos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfilePhotos" ADD CONSTRAINT "ProfilePhotos_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "MemoriaProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
