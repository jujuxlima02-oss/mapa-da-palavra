-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingMode" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "shippingPrice" INTEGER NOT NULL DEFAULT 0;
