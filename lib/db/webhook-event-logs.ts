import { Prisma, WebhookEventLogStatus } from "@prisma/client";
import { prisma } from ".";

export const createWebhookEventLog = async (data: {
  webhookId: string;
  payload: Prisma.InputJsonValue;
  status: WebhookEventLogStatus;
  statusCode: number;
  response: Prisma.InputJsonValue;
}) => {
  return await prisma.webhookEventLog.create({
    data,
  });
};

export const getWebhookEventLogs = async (queryOptions: {
  userId?: string;
  webhookId?: string;
  status?: WebhookEventLogStatus;
  limit?: number;
  offset?: number;
}) => {
  const { userId, webhookId, status, limit, offset } = queryOptions;
  return await prisma.webhookEventLog.findMany({
    where: {
      ...(userId && { webhook: { userId } }),
      ...(webhookId && { webhookId }),
      ...(status && { status }),
    },
    take: limit,
    skip: offset,
  });
};

export const deleteWebhookEventLogsByWebhookId = async (webhookId: string) => {
  try {
    await prisma.webhookEventLog.deleteMany({
      where: { webhookId },
    });
  } catch (error) {
    console.error("Error deleting webhook event logs by user:", error);
    throw error;
  }
};