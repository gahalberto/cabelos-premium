/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeInvoiceId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_paymentId_key" ON "Profile"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeInvoiceId_key" ON "Subscription"("stripeInvoiceId");
