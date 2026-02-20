import { NextRequest, NextResponse } from "next/server";
import { createInbound, listInbounds } from "@/lib/mock-db";
import { getFilters, getMockState, guardMockState } from "@/lib/mock-http";

export async function GET(request: NextRequest) {
  const guarded = await guardMockState(request);
  if (guarded) {
    return guarded;
  }
  if (getMockState(request) === "empty") {
    return NextResponse.json({ data: { items: [], total: 0, page: 1, pageSize: 10 } });
  }

  return NextResponse.json({ data: listInbounds(getFilters(request)) });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const data = createInbound(payload);
  return NextResponse.json({ data, message: "Tạo inbound thành công" }, { status: 201 });
}
