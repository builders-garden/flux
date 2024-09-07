/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventType]` on the table `Webhook` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Webhook_eventType_key";

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_userId_eventType_key" ON "Webhook"("userId", "eventType");
