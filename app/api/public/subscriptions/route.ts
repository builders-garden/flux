import { getProductById } from "@/lib/db/products";
import { createSubscription as createContractSubscription } from "@/lib/subscriptions/subscription";
import {
  createSubscription,
  getSubscriptionsBySubscriberAddress,
} from "@/lib/db/subscription";
import { FLUX_SUB_ABI } from "@/lib/subscriptions/sub-abi";
import { chainParser } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import {
  createPublicClient,
  decodeEventLog,
  encodeEventTopics,
  http,
} from "viem";
import { prisma } from "@/lib/db";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const address = url.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address not provided" },
        { status: 400 }
      );
    }

    const subscriptions = await getSubscriptionsBySubscriberAddress(address);

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error getting subscriptions:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      address,
      productId,
      tokenAddress,
      tokenAmount,
      merchantAddress,
      chainId,
      interval = 30 * 24 * 60 * 60,
    } = body;

    const txHash = await createContractSubscription(
      address!,
      merchantAddress,
      parseInt(chainId),
      BigInt(tokenAmount),
      30 * 24 * 60 * 60
    );

    const publicClient = createPublicClient({
      chain: chainParser(parseInt(chainId)),
      transport: http(),
    });

    const txReceipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    const topics = encodeEventTopics({
      abi: FLUX_SUB_ABI,
      eventName: "SubscriptionCreated",
    });

    const decodedEvent = decodeEventLog({
      abi: FLUX_SUB_ABI,
      eventName: "SubscriptionCreated",
      topics: [topics[0]],
      // @ts-expect-error - Fix this
      data: txReceipt.logs.find((log) => log.topics.includes(topics[0]))?.data,
    });

    const subscriptionId = decodedEvent?.args?.subscriptionId;

    if (subscriptionId) {
      const product = await getProductById(productId);

      const subscription = await createSubscription({
        subscriptionId: subscriptionId.toString(),
        subscriberAddress: address,
        merchantAddress: product?.user.smartAccountAddress!,
        hash: txHash,
        productId,
        tokenAddress,
        interval,
        chainId: parseInt(chainId),
      });

      return NextResponse.json(subscription);
    }

    return NextResponse.json(
      { error: "Subscription not created" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const subscriptionId = url.searchParams.get("subscriptionId");

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID not provided" },
        { status: 400 }
      );
    }

    await prisma.subscription.delete({
      where: { id: subscriptionId },
    });

    return NextResponse.json({ message: "Subscription canceled" });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
