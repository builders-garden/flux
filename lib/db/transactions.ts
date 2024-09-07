import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function createTransaction(hash: string, amount: number, customerId: string) {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        hash,
        amount: new Prisma.Decimal(amount),
        customerId,
      },
    });
    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getTransactionByHash(hash: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { hash },
      include: { customer: true },
    });
    return transaction;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getTransactionsByCustomerId(customerId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions by customer:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
