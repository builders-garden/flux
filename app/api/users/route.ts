import { createUser } from "@/lib/db/users";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { email, address, smartAccountAddress } = body;
  if (!email || !address || !smartAccountAddress) {
    return NextResponse.json(
      { error: "Missing reqired filed 'email' or 'address'" },
      {
        status: 422,
      }
    );
  }
  const data = await createUser(address, email, smartAccountAddress);
  return NextResponse.json(data);
};
