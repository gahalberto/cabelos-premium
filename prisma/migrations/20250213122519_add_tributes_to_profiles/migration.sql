-- CreateTable
CREATE TABLE "ProfileTributes" (
    "id" SERIAL NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProfileTributes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileTributes" ADD CONSTRAINT "ProfileTributes_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "MemoriaProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
