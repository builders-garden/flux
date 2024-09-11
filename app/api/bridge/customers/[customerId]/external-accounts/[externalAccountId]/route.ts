import { deleteExternalAccount, getExternalAccount } from "@/lib/bridge";
import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/lib/db/users";

export const GET = async (
  req: NextRequest,
  {
    params: { customerId, externalAccountId },
  }: { params: { customerId: string; externalAccountId: string } }
) => {
  const data = await getExternalAccount(customerId, externalAccountId);
  return NextResponse.json(data);
};

export const DELETE = async (
  req: NextRequest,
  {
    params: { customerId, externalAccountId },
  }: { params: { customerId: string; externalAccountId: string } }
) => {
  const address = req.headers.get("x-address")!;

  const data = await deleteExternalAccount(customerId, externalAccountId);
  await updateUser(address, {
    bridgeExternalAccountId: null,
  });
  return NextResponse.json(data);
};
