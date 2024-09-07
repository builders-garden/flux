import { prisma } from "./index"

export async function createTransaction(data: {
  hash: string;
  amount: string;
  customerId: string;
  productId: string;
  timestamp: Date;
  userId: string;
}) {
  try {
    const newTransaction = await prisma.transaction.create({
      data,
    });
    return newTransaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getTransactionsByCustomerId(customerId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { customerId },
    });
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getTransactionsByUserId(userId: string, {
  limit = 10,
  offset = 0,
}: {
  limit: number;
  offset: number;
}) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      take: limit,
      skip: offset,
    });
    const totalCount = await prisma.transaction.count({
      where: { userId },
    });
    return {
      transactions,
      totalCount,
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}