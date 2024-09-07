import { NextRequest, NextResponse } from "next/server";
import { getPaymentLinkBySlug } from "@/lib/db/paymentLinks";

export const GET = async (req: NextRequest, { params: {slug} }: { params: { slug: string } }) => {
  const { searchParams } = new URL(req.url);
  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }
  const paymentLink = await getPaymentLinkBySlug(slug);
  if (!paymentLink) {
    return NextResponse.json(
      { error: "Payment link not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(paymentLink);
};
