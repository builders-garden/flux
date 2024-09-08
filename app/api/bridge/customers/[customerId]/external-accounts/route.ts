import { createExternalAccount } from "@/lib/bridge/index";
import { updateUser, getUserByAddress } from "@/lib/db/users";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params: { customerId } }: { params: { customerId: string } }
) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address!)!;
  if (user!.bridgeExternalAccountId) {
    return NextResponse.json(
      { error: "External account already linked" },
      {
        status: 400,
      }
    );
  }
  const body = await req.json();
  const firstName = user!.fullName?.split(" ")[0];
  const lastName = user!.fullName?.split(" ")[1];
  const data = await createExternalAccount(customerId, {
    accountNumber: body.accountNumber,
    bic: body.bic,
    country: body.country,
    address: {
      street: body.address,
      city: body.city,
      country: body.country,
      postalCode: body.postalCode,
    },
    accountOwnerName: {
      firstName: firstName,
      lastName: lastName,
    },
  });
  await updateUser(address, {
    bridgeExternalAccountId: data.id,
  });
  return NextResponse.json(data);
};
