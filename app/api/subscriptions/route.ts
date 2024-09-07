import { getSubscriptionsByMerchantAddress } from "@/lib/db/subscription";
import { getUserByAddress } from "@/lib/db/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const subscriptions = await getSubscriptionsByMerchantAddress(
    user.smartAccountAddress!
  );
  return NextResponse.json(subscriptions);
}
