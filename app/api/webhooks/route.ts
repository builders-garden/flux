import { getUserByAddress } from "@/lib/db/users";
import { createWebhook, getWebhooksByUserId } from "@/lib/db/webhook";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const address = req.headers.get("x-address")!;

  const user = await getUserByAddress(address)!;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();

  const { name, url, eventType } = body;

  const webhook = await createWebhook(user.id, { name, url, eventType });

  return NextResponse.json(webhook);
};

export const GET = async (req: Request) => {
  const address = req.headers.get("x-address")!;
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : 10;
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 0;
  const user = await getUserByAddress(address)!;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const webhooks = await getWebhooksByUserId(user.id, {
    limit,
    offset: page * limit,
  });

  return NextResponse.json(webhooks);
};
