import { checkKYBStatus } from "@/lib/bridge/index";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const data = await checkKYBStatus(id);
  return NextResponse.json(data);
};
