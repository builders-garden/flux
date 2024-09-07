import { prisma } from "./index"

export async function createCustomer(address: string, userId: string) {
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        address,
        userId,
      },
    });
    return newCustomer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getCustomersByUserId(userId: string) {
  try {
    const customers = await prisma.customer.findMany({
      where: { userId },
      include: { transactions: true },
    });
    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

