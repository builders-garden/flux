import {
  createPaymentLink,
  getPaymentLinkBySlug,
  getPaymentLinksByUser,
} from "@/lib/db/paymentLinks";
import { getUserByAddress } from "@/lib/db/users";
import { nameToSlug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const paymentLinks = await getPaymentLinksByUser(user.id);

  return NextResponse.json(paymentLinks);
};

export const POST = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, productId, requiresWorldId } = body;

  const slug = nameToSlug(name as string);

  const existingProduct = await getPaymentLinkBySlug(slug);

  if (existingProduct) {
    return NextResponse.json(
      { error: "Payment link already exists" },
      { status: 400 }
    );
  }

  const paymentLink = await createPaymentLink(user.id, productId, name, slug, requiresWorldId);

  return NextResponse.json(paymentLink);
};
