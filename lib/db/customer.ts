import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createCustomer(address: string) {
  try {
    const customer = await prisma.customer.create({
      data: { address },
    });
    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getCustomerByAddress(address: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { address },
      include: { transactions: true },
    });
    return customer;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getCustomerWithTransactions(customerId: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return customer;
  } catch (error) {
    console.error('Error fetching customer with transactions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
