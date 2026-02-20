import { NextRequest, NextResponse } from "next/server";
import { fallbackRules } from "@/lib/mock-phase2";

export async function GET() {
  return NextResponse.json({ data: fallbackRules });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({ data: payload, message: "Lưu fallback thành công" });
}
