import { getKYCLink } from "@/lib/bridge/index";
import { updateUser } from "@/lib/db/users";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const address = req.headers.get("x-address")!;
  const body = await req.json();
  const { fullName, email } = body;
  if (!fullName || !email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      {
        status: 422,
      }
    );
  }
  const data = await getKYCLink(fullName, email);
  await updateUser(address, {
    bridgeKycLinkId: data.id,
    bridgeCustomerId: data.customer_id,
  });
  return NextResponse.json(data);
};
