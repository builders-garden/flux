import { getCustomersByUserId } from "@/lib/db/customer";
import { getUserByAddress } from "@/lib/db/users";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);
  const customers = await getCustomersByUserId(user!.id);
  return NextResponse.json(customers);
};
