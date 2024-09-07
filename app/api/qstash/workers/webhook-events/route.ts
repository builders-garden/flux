import { getWebhookById } from "@/lib/db/webhook";
import { createWebhookEventLog } from "@/lib/db/webhook-event-logs";
import { WebhookEventLogStatus } from "@prisma/client";
import { createPrivateKey, sign } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { data } = await req.json();
  const { webhookId, payload } = data;
  const webhook = await getWebhookById(webhookId);

  if (!webhook) {
    console.error("Webhook not found");
    return NextResponse.json(
      { success: false, message: "Webhook not found" },
      { status: 404 }
    );
  }

  const privateKey = createPrivateKey(process.env.WEBHOOK_EVENTS_PRIVATE_KEY!);
  const signature = sign(
    "sha256",
    Buffer.from(JSON.stringify({ url: webhook.url, payload })),
    privateKey
  ).toString("base64");
  const response = await fetch(webhook.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-flux-signature": signature,
    },
    body: JSON.stringify({
      metadata: {
        id: webhook.id,
        name: webhook.name,
        event: webhook.event,
      },
      payload,
    }),
  });

  let status: WebhookEventLogStatus = WebhookEventLogStatus.UNKNOWN;
  if (response.status === 200) {
    status = WebhookEventLogStatus.SUCCESS;
  }
  if (response.status === 400) {
    status = WebhookEventLogStatus.BAD_REQUEST;
  }
  if (response.status === 401) {
    status = WebhookEventLogStatus.UNAUTHORIZED;
  }
  if (response.status === 404) {
    status = WebhookEventLogStatus.NOT_FOUND;
  }
  if (response.status === 500) {
    status = WebhookEventLogStatus.INTERNAL_SERVER_ERROR;
  }
  if (response.status === 504) {
    status = WebhookEventLogStatus.TIMEOUT;
  }

  const responseBody = await response.json();
  await createWebhookEventLog({
    webhookId,
    payload,
    status,
    statusCode: response.status,
    response: responseBody,
  });
  return NextResponse.json({ message: "OK" });
};
