import { relayTransactionCreation } from "@/lib/qstash";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { userId, productId, hash, amount, fromAddress, timestamp } = body;

  await relayTransactionCreation({
    userId,
    productId,
    hash,
    amount,
    fromAddress,
    timestamp,
  });

  return NextResponse.json({
    message: "Transaction creation added to queue",
  });
};
