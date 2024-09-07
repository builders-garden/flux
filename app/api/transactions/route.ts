import { createCustomer, getCustomerByAddress } from "@/lib/db/customer";
import {
  createTransaction,
  getTransactionsByUserId,
} from "@/lib/db/transactions";
import { getUserByAddress } from "@/lib/db/users";
import { Customer } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { userId, productId, hash, amount, fromAddress, timestamp } = body;
  let customer: Customer | null;
  try {
    customer = await getCustomerByAddress(fromAddress);
  } catch (e) {
    customer = await createCustomer(fromAddress, userId);
  }

  if (!customer) {
    return NextResponse.json(
      {
        message: "Error finding customer",
      },
      {
        status: 400,
      }
    );
  }

  const transaction = await createTransaction({
    hash,
    amount,
    customerId: customer?.id,
    productId,
    timestamp: new Date(timestamp),
    userId,
  });

  return NextResponse.json(transaction);
};

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;

  const user = await getUserByAddress(address);
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : 10;
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 0;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await getTransactionsByUserId(user.id, {
    limit,
    offset: page * limit,
  });
  return NextResponse.json(transactions);
};
