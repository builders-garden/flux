-- CreateEnum
CREATE TYPE "WebhookEventLogStatus" AS ENUM ('SUCCESS', 'BAD_REQUEST', 'UNAUTHORIZED', 'NOT_FOUND', 'INTERNAL_SERVER_ERROR', 'TIMEOUT', 'UNKNOWN');

-- CreateTable
CREATE TABLE "WebhookEventLog" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "response" JSONB,
    "status" "WebhookEventLogStatus" NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEventLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WebhookEventLog" ADD CONSTRAINT "WebhookEventLog_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
