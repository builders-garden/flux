import { createProduct, getProductsByUser } from "@/lib/db/products";
import { getUserByAddress } from "@/lib/db/users";
import { uploadImage } from "@/lib/imagekit";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const address = req.headers.get("address")!;
  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const body = await req.formData();
  const name = body.get("name") as string;
  const description = body.get("description") as string;
  const price = body.get("price") as string;
  const image: File | null = body.get("files[0]") as unknown as File;

  const requiredFields = { name, price, image, description };
  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      return NextResponse.json(
        { message: `Missing required field: ${field}` },
        { status: 422 }
      );
    }
  }
  const imageUrl = await uploadImage(image, `product-${name}-${user!.id}`);

  const product = await createProduct(
    name,
    description,
    imageUrl,
    parseFloat(price),
    user!.id
  );

  return NextResponse.json(product);
};

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("address")!;
  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const products = await getProductsByUser(user.id);
  return NextResponse.json(products);
};
