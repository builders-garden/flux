import { createWebhookEventLog } from "@/lib/db/webhook-event-logs";
import { WebhookEventLogStatus } from "@prisma/client";
import { createPrivateKey, sign } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { data } = await req.json();
  const { webhook, payload } = data;

  const webhookPayload = {
    metadata: {
      webhookId: webhook.id,
      webhookName: webhook.name,
      eventType: webhook.eventType,
      timestamp: Date.now(),
    },
    eventData: payload,
  };

  const privateKey = createPrivateKey(process.env.WEBHOOK_EVENTS_PRIVATE_KEY!);
  const signature = sign(
    "sha256",
    Buffer.from(JSON.stringify({ url: webhook.url, payload: webhookPayload })),
    privateKey
  ).toString("base64");

  const response = await fetch(webhook.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-flux-signature": signature,
    },
    body: JSON.stringify(webhookPayload),
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
    webhookId: webhook.id,
    payload,
    status,
    statusCode: response.status,
    response: responseBody,
  });
  return NextResponse.json({ message: "OK" });
};
