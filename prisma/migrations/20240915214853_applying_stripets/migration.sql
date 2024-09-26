-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "stripeInvoiceId" TEXT;
