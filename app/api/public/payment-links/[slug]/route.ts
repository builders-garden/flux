import { NextRequest, NextResponse } from "next/server";
import { getPaymentLinkBySlug } from "@/lib/db/paymentLinks";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
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
