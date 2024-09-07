import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/db/products";
import { getUserByAddress } from "@/lib/db/users";
import { uploadImage } from "@/lib/imagekit";
import { PaymentMethod } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const product = await getProductById(id);
  if (!product || product.userId !== user.id) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
};

export const PUT = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const product = await getProductById(id);
  if (!product || product.userId !== user.id) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
  const body = await req.formData();
  const name = body.get("name") as string;
  const description = body.get("description") as string;
  const price = body.get("price") as string;
  const paymentMethod = body.get("paymentMethod") as PaymentMethod;
  const image: File | null = body.get("files[0]") as unknown as File;

  let imageUrl: string = "";
  if (image) {
    imageUrl = await uploadImage(image, `product-${name}-${user!.id}`);
  }
  const updatedProduct = await updateProduct(id, {
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    ...(price ? { price: parseFloat(price) } : {}),
    ...(paymentMethod ? { paymentMethod } : {}),
    ...(image ? { imageUrl } : {}),
  });
  return NextResponse.json(updatedProduct);
};

export const DELETE = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const address = req.headers.get("x-address")!;
  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const product = await getProductById(id);
  if (!product || product.userId !== user.id) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
  await deleteProduct(id);
  return NextResponse.json({ message: "Product deleted" });
};
