import { Client } from "@upstash/qstash";

if (!process.env.QSTASH_TOKEN) {
  throw new Error("QSTASH_TOKEN is not set");
}

export async function publishToQstash(
  endpoint: string,
  data: { [key: string]: unknown },
  delay: number
): Promise<{ response: string }> {
  // Get the Qstash client
  const qstashClient = new Client({
    token: process.env.QSTASH_TOKEN!,
  });

  // Send payload to the Qstash API
  try {
    await qstashClient.publishJSON({
      url: endpoint,
      body: {
        data: data,
      },
      delay: delay,
    });
    return { response: "ok" };
  } catch (error) {
    console.error("Error while publishing json to QStash: ", error);
    return { response: "ko" };
  }
}

export const relayTransactionCreation = async (data: {
  userId: string;
  productId: string;
  hash: string;
  amount: number;
  fromAddress: string;
  timestamp: number;
}) => {
  await publishToQstash(
    `${process.env.BASE_URL}/api/qstash/workers/transactions`,
    data,
    0
  );
};

export const relayWebhookEvent = async (data: {
  webhookId: string;
  payload: { [key: string]: unknown };
}) => {
  await publishToQstash(
    `${process.env.BASE_URL}/api/qstash/workers/webhook-events`,
    data,
    0
  );
};
