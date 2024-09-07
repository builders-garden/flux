-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('RECURRING', 'ONE_TIME');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'ONE_TIME';
