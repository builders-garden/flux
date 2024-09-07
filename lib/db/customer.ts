import { prisma } from "./index";

export async function createCustomer(address: string, userId: string) {
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        address: address.toLowerCase(),
        userId,
      },
    });
    return newCustomer;
  } catch (error) {
    console.error("Error creating customer:", error);
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
    console.error("Error fetching customers:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getCustomerByAddress(address: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { address: address.toLowerCase() },
    });
    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
}
