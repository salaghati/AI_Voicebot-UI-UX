import { NextRequest, NextResponse } from "next/server";
import { createKbFallbackRule, listKbFallbackRules } from "@/lib/mock-phase2";
import { getMockState, guardMockState } from "@/lib/mock-http";

export async function GET(request: NextRequest) {
  const guarded = await guardMockState(request);
  if (guarded) {
    return guarded;
  }
  if (getMockState(request) === "empty") {
    return NextResponse.json({ data: [] });
  }
  let rules = listKbFallbackRules();
  if (request.nextUrl.searchParams.get("active") === "true") {
    rules = rules.filter((r) => r.active);
  }
  return NextResponse.json({ data: rules });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const data = createKbFallbackRule(payload);
  return NextResponse.json({ data, message: "Tạo KB fallback thành công" }, { status: 201 });
}
