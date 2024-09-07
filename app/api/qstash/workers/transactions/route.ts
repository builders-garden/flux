import { getCustomerByAddress, createCustomer } from "@/lib/db/customer";
import { createTransaction } from "@/lib/db/transactions";
import { relayWebhookEvent } from "@/lib/qstash";
import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { getEnsAvatar, getEnsName } from "viem/actions";
import { mainnet } from "viem/chains";

export const POST = async (req: NextRequest) => {
  const { data } = await req.json();
  const { userId, productId, hash, amount, fromAddress, timestamp } = data;
  let customer = await getCustomerByAddress(fromAddress);

  if (!customer) {
    const publicClient = createPublicClient({
      transport: http(),
      chain: mainnet,
    });
    const ens = await getEnsName(publicClient, fromAddress);
    const ensAvatar = await getEnsAvatar(publicClient, fromAddress);

    customer = await createCustomer(
      fromAddress,
      userId,
      ens as string | undefined,
      ensAvatar as string | undefined
    );
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
