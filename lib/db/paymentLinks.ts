import { prisma } from "./index";

export async function createPaymentLink(
  userId: string,
  productId: string,
  name: string,
  slug: string,
  requiresWorldId: boolean,
  redirectUrl: string
) {
  try {
    const newPaymentLink = await prisma.paymentLink.create({
      data: {
        userId,
        productId,
        slug,
        name,
        requiresWorldId,
        redirectUrl,
      },
    });

    return newPaymentLink;
  } catch (error) {
    console.error("Error creating payment link:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updatePaymentLink(
  id: string,
  data: {
    name?: string;
    slug?: string;
    requiresWorldId?: boolean;
    redirectUrl?: string;
  }
) {
  try {
    const updatedPaymentLink = await prisma.paymentLink.update({
      where: { id },
      data,
    });
    return updatedPaymentLink;
  } catch (error) {
    console.error("Error updating payment link:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getPaymentLink(id: string) {
  try {
    const paymentLink = await prisma.paymentLink.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });
    return paymentLink;
  } catch (error) {
    console.error("Error fetching payment link:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getPaymentLinksByUser(userId: string) {
  try {
    const paymentLinks = await prisma.paymentLink.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
    return paymentLinks;
  } catch (error) {
    console.error("Error fetching payment links by user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getPaymentLinksByProduct(productId: string) {
  try {
    const paymentLinks = await prisma.paymentLink.findMany({
      where: { productId },
      include: {
        user: true,
      },
    });
    return paymentLinks;
  } catch (error) {
    console.error("Error fetching payment links by product:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function deletePaymentLink(id: string, slug: string) {
  try {
    await prisma.record.delete({
      where: {
        name: `${slug}.fluxlink.eth`,
      },
    });

    await prisma.paymentLink.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting payment link:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getPaymentLinkBySlug(slug: string) {
  try {
    const paymentLink = await prisma.paymentLink.findUnique({
      where: { slug },
      include: {
        user: true,
        product: true,
      },
    });
    return paymentLink;
  } catch (error) {
    console.error("Error fetching payment link:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export const deletePaymentLinksByUser = async (userId: string) => {
  try {
    await prisma.paymentLink.deleteMany({
      where: { userId },
    });
  } catch (error) {
    console.error("Error deleting payment links by user:", error);
    throw error;
  }
};
