import { prisma } from "./index"

export async function createTransaction(hash: string, amount: string, customerId: string, productId: string, timestamp: Date) {
  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        hash,
        amount,
        customerId,
        productId,
        timestamp
      },
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

// Add other transaction-related functions as needed
