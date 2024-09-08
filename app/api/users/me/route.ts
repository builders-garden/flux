import { getUserByAddress, updateUser } from "@/lib/db/users";
import { uploadImage } from "@/lib/imagekit";
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
  const body = await req.formData();

  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const email = body.get("email") as string;
  const smartAccountAddress = body.get("smartAccountAddress") as string;
  const fullName = body.get("fullName") as string;
  const companyName = body.get("companyName") as string;
  const companyUrl = body.get("companyUrl") as string;
  const bankAccountNumber = body.get("bankAccountNumber") as string;
  const bankAccountBic = body.get("bankAccountBic") as string;
  const bankAccountCountry = body.get("bankAccountCountry") as string;

  const companyImage: File | null = body.get("files[0]") as unknown as File;

  let companyImageUrl: string = "";
  if (companyImage) {
    companyImageUrl = await uploadImage(
      companyImage,
      `product-${name}-${user!.id}`
    );
  }
  const data = await updateUser(user.id, {
    ...(email ? { email } : {}),
    ...(smartAccountAddress ? { smartAccountAddress } : {}),
    ...(fullName ? { fullName } : {}),
    ...(companyName ? { companyName } : {}),
    ...(companyUrl ? { companyUrl } : {}),
    ...(companyImage ? { companyImage: companyImageUrl } : {}),
    ...(bankAccountNumber ? { bankAccountNumber } : {}),
    ...(bankAccountBic ? { bankAccountBic } : {}),
    ...(bankAccountCountry ? { bankAccountCountry } : {}),
  });
  return NextResponse.json(data);
};
