import {
  createPaymentLink,
  getPaymentLinkBySlug,
  getPaymentLinksByUser,
} from "@/lib/db/paymentLinks";
import { getProductById } from "@/lib/db/products";
import { createRecord } from "@/lib/db/records";
import { getUserByAddress } from "@/lib/db/users";
import { nameToSlug } from "@/lib/utils";
import { createNewIncognitoAction } from "@/lib/world-id";
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
  const { name, productId, requiresWorldId, redirectUrl } = body;

  const product = await getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const slug = nameToSlug(name as string);

  const existingProductLink = await getPaymentLinkBySlug(slug);

  if (existingProductLink) {
    return NextResponse.json(
      { error: "Payment link already exists" },
      { status: 400 }
    );
  }

  const paymentLink = await createPaymentLink(
    user.id,
    productId,
    name,
    slug,
    requiresWorldId,
    redirectUrl
  );

  await createRecord(slug, address);

  if (requiresWorldId) {
    await createNewIncognitoAction(productId, product.name, paymentLink.id, 1);
  }

  return NextResponse.json(paymentLink);
};
