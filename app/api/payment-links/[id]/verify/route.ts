import { getPaymentLink } from "@/lib/db/paymentLinks";
import { PRODUCT_PURCHASE_ACTION_ID, verifyProof } from "@/lib/world-id";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const body = await req.json();
  const { proof, signal } = body;
  const paymentLink = await getPaymentLink(id);
  if (!paymentLink) {
    return NextResponse.json(
      { message: "Payment link not found" },
      { status: 404 }
    );
  }
  const verifyRes = await verifyProof(
    proof,
    PRODUCT_PURCHASE_ACTION_ID(paymentLink?.productId, id)
  );

  return NextResponse.json(verifyRes, {
    status: verifyRes.success ? 200 : 400,
  });
};
