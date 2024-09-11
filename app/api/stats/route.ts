import { prisma } from "@/lib/db";
import { getTransactionsStats } from "@/lib/db/transactions";
import { getUserByAddress } from "@/lib/db/users";
import { NextResponse } from "next/server";

export const maxDuration = 300;

export const GET = async (req: Request) => {
  const address = req.headers.get("x-address")!;

  const user = await getUserByAddress(address)!;
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [numCustomers, numProducts, numSubscriptions, transactions] =
    await Promise.all([
      prisma.customer.count({
        where: {
          userId: user.id,
        },
      }),
      prisma.product.count({
        where: {
          userId: user.id,
        },
      }),
      prisma.subscription.count({
        where: {
          merchantAddress: user.smartAccountAddress!,
        },
      }),
      getTransactionsStats(user.id),
    ]);

  const totalAmount = transactions.reduce(
    (acc, transaction) => acc + transaction.totalAmount,
    0
  );

  return NextResponse.json({
    numCustomers,
    numProducts,
    numSubscriptions,
    totalAmount,
    transactions,
  });
};
