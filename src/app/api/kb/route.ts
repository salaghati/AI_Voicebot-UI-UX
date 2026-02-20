import { NextRequest, NextResponse } from "next/server";
import { createMockKbDoc, listKbDocs } from "@/lib/mock-phase2";
import { getMockState, guardMockState } from "@/lib/mock-http";

export async function GET(request: NextRequest) {
  const guarded = await guardMockState(request);
  if (guarded) {
    return guarded;
  }
  if (getMockState(request) === "empty") {
    return NextResponse.json({ data: [] });
  }
  return NextResponse.json({ data: listKbDocs() });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const data = createMockKbDoc(payload);
  return NextResponse.json({ data, message: "Thêm KB thành công" }, { status: 201 });
}
