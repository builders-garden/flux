import { prisma } from "./index"


export async function createWebhook(userId: string, data: {name: string, url: string, event: string}) {
  try {
    const webhook = await prisma.webhook.create({
      data: {
        ...data,
        userId
      }
    });
    return webhook;
  } catch (error) {
    console.error('Error creating webhook:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteWebhook(id: string) {
  try {
    await prisma.webhook.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    throw error;
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

export async function getWebhooksByUserId(userId: string, {
  limit,
  offset
}: {
  limit: number,
  offset: number  
}) {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: {
        userId
      },
      take: limit,
      skip: offset
    });
    return webhooks;
  } catch (error) {
    console.error('Error fetching all webhooks:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateWebhook(id: string, data: {name?: string, url?: string, event?: string}) {
  try {
    const webhook = await prisma.webhook.update({
      where: { id },
      data
    });
    return webhook;
  } catch (error) {
    console.error('Error updating webhook:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}