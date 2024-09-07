import { getUserByAddress, updateUser } from "@/lib/db/users";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      { status: 404 }
    );
  }
  return NextResponse.json(user);
};

export const PUT = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;
  const body = await req.json();
  const { email, smartAccountAddress } = body;

  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const data = await updateUser(user.id, {
    email,
    smartAccountAddress
  });
  return NextResponse.json(data);
};
