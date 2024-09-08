import { getCustomerDetails } from "@/lib/bridge/index";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params: { customerId } }: { params: { customerId: string } }
) => {
  const data = await getCustomerDetails(customerId);
  return NextResponse.json(data);
};
