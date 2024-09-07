import { getUserByAddress } from "@/lib/db/users";
import { getWebhookById, deleteWebhook, updateWebhook } from "@/lib/db/webhook";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address)!;
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const webhook = await getWebhookById(id, user.id);
  if (!webhook || webhook.userId !== user.id) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }
  await deleteWebhook(id);
  return NextResponse.json({ message: "Webhook deleted" });
};

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address)!;
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const webhook = await getWebhookById(id, user.id);
  if (!webhook || webhook.userId !== user.id) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }
  const { name, url, event } = await req.json();
  await updateWebhook(id, {
    ...(name && { name }),
    ...(url && { url }),
    ...(event && { event }),
  });
  return NextResponse.json({ message: "Webhook updated" });
};

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address)!;
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const webhook = await getWebhookById(id, user.id);
  if (!webhook || webhook.userId !== user.id) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }
  return NextResponse.json(webhook);
};
