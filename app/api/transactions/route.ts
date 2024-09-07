import { getTransactionsByUserId } from "@/lib/db/transactions";
import { getUserByAddress } from "@/lib/db/users";
import { publishToQstash } from "@/lib/qstash";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { userId, productId, hash, amount, fromAddress, timestamp } = body;

  await publishToQstash(
    `${process.env.BASE_URL}/api/qstash/workers/transactions`,
    {
      userId,
      productId,
      hash,
      amount,
      fromAddress,
      timestamp,
    },
    0
  );

  return NextResponse.json({
    message: "Transaction creation added to queue",
  });
};

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;

  const user = await getUserByAddress(address);
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : 10;
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 0;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await getTransactionsByUserId(user.id, {
    limit,
    offset: page * limit,
  });
  return NextResponse.json(transactions);
};
