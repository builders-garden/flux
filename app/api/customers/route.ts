import {
  getFirstTimeCustomers,
  getRecentCustomers,
  getTopCustomers,
} from "@/lib/db/customer";
import { getUserByAddress } from "@/lib/db/users";
import { NextRequest, NextResponse } from "next/server";

enum CustomerFilter {
  TOP = "top",
  NEW = "new",
  RECENT = "recent",
}

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : 10;
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 0;
  // filter can be "top", "new", "recent"
  const filter = searchParams.get("filter") || CustomerFilter.RECENT;
  const user = await getUserByAddress(address);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (filter === CustomerFilter.TOP) {
    const customers = await getTopCustomers(user!.id, {
      limit,
      offset: page * limit,
    });
    return NextResponse.json(customers);
  }
  if (filter === CustomerFilter.NEW) {
    const customers = await getFirstTimeCustomers(user!.id, {
      limit,
      offset: page * limit,
    });
    return NextResponse.json(customers);
  }
  const customers = await getRecentCustomers(user!.id, {
    limit,
    offset: page * limit,
  });
  return NextResponse.json(customers);
};
