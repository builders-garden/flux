import {
  deletePaymentLink,
  getPaymentLink,
  getPaymentLinkBySlug,
  updatePaymentLink,
} from "@/lib/db/paymentLinks";
import { getUserByAddress } from "@/lib/db/users";
import { nameToSlug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const paymentLink = await getPaymentLinkBySlug(id);

  if (!paymentLink) {
    return NextResponse.json(
      { error: "Payment link not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(paymentLink);
};

export const PUT = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, requiresWorldId, redirectUrl } = body;

  const slug = nameToSlug(name as string);

  const paymentLink = await updatePaymentLink(id, {
    ...(name ? { name } : {}),
    ...(slug ? { slug } : {}),
    ...(requiresWorldId ? { requiresWorldId } : {}),
    ...(redirectUrl ? { redirectUrl } : {}),
  });

  return NextResponse.json(paymentLink);
};

export const DELETE = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const paymentLink = await getPaymentLink(id);

  if (!paymentLink || paymentLink.userId !== user.id) {
    return NextResponse.json(
      { error: "Payment link not found" },
      { status: 404 }
    );
  }

  const deletedPaymentLink = await deletePaymentLink(id, paymentLink.slug);

  return NextResponse.json(deletedPaymentLink);
};
