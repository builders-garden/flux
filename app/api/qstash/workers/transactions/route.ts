import { getCustomerByAddress, createCustomer } from "@/lib/db/customer";
import { createTransaction } from "@/lib/db/transactions";
import { relayWebhookEvent } from "@/lib/qstash";
import { Customer } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { userId, productId, hash, amount, fromAddress, timestamp } = body;
  let customer: Customer | null;
  try {
    customer = await getCustomerByAddress(fromAddress);
  } catch (e) {
    customer = await createCustomer(fromAddress, userId);
  }

  if (!customer) {
    return NextResponse.json(
      {
        message: "Error finding customer",
      },
      {
        status: 400,
      }
    );
  }

  const transaction = await createTransaction({
    hash,
    amount,
    customerId: customer?.id,
    productId,
    timestamp: new Date(timestamp),
    userId,
  });

  await relayWebhookEvent({
    webhookId: transaction.id,
    data: transaction,
  });

  return NextResponse.json(transaction);
};
