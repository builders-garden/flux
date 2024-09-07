import {
  createProduct,
  getProductById,
  getProductsByUser,
} from "@/lib/db/products";
import { getUserByAddress } from "@/lib/db/users";
import { uploadImage } from "@/lib/imagekit";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (productId) {
    const product = await getProductById(productId);
    if (!product || product.userId !== user.id) {
      return NextResponse.json(
        { message: "Product to duplicate not found" },
        { status: 404 }
      );
    }
    const duplicateProduct = await createProduct(
      `${product.name} - Copy`,
      product.description,
      product.imageUrl,
      parseFloat(product.price.toString()),
      user.id
    );
    return NextResponse.json(duplicateProduct);
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
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const products = await getProductsByUser(user.id);
  return NextResponse.json(products);
};
