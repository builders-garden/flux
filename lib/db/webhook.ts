import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createWebhook(name: string, url: string, event: string) {
  try {
    const webhook = await prisma.webhook.create({
      data: { name, url, event },
    });
    return webhook;
  } catch (error) {
    console.error('Error creating webhook:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getWebhookById(id: string) {
  try {
    const webhook = await prisma.webhook.findUnique({
      where: { id },
    });
    return webhook;
  } catch (error) {
    console.error('Error fetching webhook:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllWebhooks() {
  try {
    const webhooks = await prisma.webhook.findMany();
    return webhooks;
  } catch (error) {
    console.error('Error fetching all webhooks:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
