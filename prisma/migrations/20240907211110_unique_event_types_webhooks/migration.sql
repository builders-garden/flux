/*
  Warnings:

  - You are about to drop the column `event` on the `Webhook` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventType]` on the table `Webhook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventType` to the `Webhook` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WebhookEventType" AS ENUM ('PAYMENT_SUCCESSFUL', 'CUSTOMER_CREATED', 'SUBSCRIPTION_CREATED', 'SUBSCRIPTION_CANCELLED');

-- AlterTable
ALTER TABLE "Webhook" DROP COLUMN "event",
ADD COLUMN     "eventType" "WebhookEventType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_eventType_key" ON "Webhook"("eventType");
