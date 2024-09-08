import { PrismaClient, Subscription } from "@prisma/client";

const prisma = new PrismaClient();

type SubscriptionCreateInput = Omit<
  Subscription,
  "id" | "createdAt" | "updatedAt" | "product"
> & {
  productId: string;
};

export async function createSubscription(data: SubscriptionCreateInput) {
  return prisma.subscription.create({
    data,
  });
}

export async function updateSubscription(
  id: string,
  data: Partial<SubscriptionCreateInput>
) {
  return prisma.subscription.update({
    where: { id },
    data,
  });
}

export async function getSubscription(id: string) {
  return prisma.subscription.findUnique({
    where: { id },
  });
}

export async function getSubscriptionByHash(hash: string) {
  return prisma.subscription.findUnique({
    where: { hash },
  });
}

export async function getSubscriptionsBySubscriberAddress(
  subscriberAddress: string
) {
  return prisma.subscription.findMany({
    where: { subscriberAddress },
    include: {
      product: true,
    },
  });
}

export async function getSubscriptionsByMerchantAddress(
  merchantAddress: string
) {
  return prisma.subscription.findMany({
    where: { merchantAddress },
    include: {
      product: {
        include: {
          user: true,
        },
      },
    },
  });
}
