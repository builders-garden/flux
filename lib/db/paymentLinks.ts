import { prisma } from "./index"


export async function createPaymentLink(
  userId: string,
  productId: string,
  link: string
) {
  try {
    const newPaymentLink = await prisma.paymentLink.create({
      data: {
        userId,
        productId,
        link,
      },
    });
    return newPaymentLink;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updatePaymentLink(
  id: string,
  data: {
    link?: string;
  }
) {
  try {
    const updatedPaymentLink = await prisma.paymentLink.update({
      where: { id },
      data,
    });
    return updatedPaymentLink;
  } catch (error) {
    console.error('Error updating payment link:', error);
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
    console.error('Error fetching payment link:', error);
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
    console.error('Error fetching payment links by user:', error);
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
    console.error('Error fetching payment links by product:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}