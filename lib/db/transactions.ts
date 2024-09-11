import { prisma } from "./index";

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
    console.error("Error creating transaction:", error);
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
    console.error("Error fetching transactions:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getTransactionsByUserId(
  userId: string,
  {
    limit = 10,
    offset = 0,
  }: {
    limit: number;
    offset: number;
  }
) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      include: { customer: true, product: true },
      orderBy: { timestamp: "desc" },
    });
    const totalCount = await prisma.transaction.count({
      where: { userId },
    });
    return {
      transactions,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export const deleteTransactionsByUserId = async (userId: string) => {
  try {
    await prisma.transaction.deleteMany({
      where: { userId },
    });
  } catch (error) {
    console.error("Error deleting transactions by user:", error);
    throw error;
  }
};

export const getTransactionsStats = async (userId: string) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const transactionStats = await prisma.transaction.findMany({
      where: {
        userId,
        timestamp: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    const formattedStats = transactionStats.reduce((acc, transaction) => {
      const date = transaction.timestamp.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { count: 0, totalAmount: 0 };
      }
      acc[date].count += 1;
      acc[date].totalAmount += parseFloat(transaction.amount);
      return acc;
    }, {} as Record<string, { count: number; totalAmount: number }>);

    // Generate an array of the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    const result = last7Days.map((date) => ({
      date,
      count: formattedStats[date]?.count || 0,
      totalAmount: formattedStats[date]?.totalAmount || 0,
    }));

    return result;
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    throw error;
  }
};
