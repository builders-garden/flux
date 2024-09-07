import { createUser, getUserByEmail, updateUser } from "@/lib/db/users";
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
  const userByEmail = await getUserByEmail(email);
  if (userByEmail && !userByEmail.smartAccountAddress) {
    const updatedUser = await updateUser(userByEmail.id, {
      smartAccountAddress,
    });
    return NextResponse.json(updatedUser);
  }
  const data = await createUser(address, email, smartAccountAddress);
  return NextResponse.json(data);
};
