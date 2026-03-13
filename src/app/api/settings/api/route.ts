import { NextRequest, NextResponse } from "next/server";
import { apiSetting } from "@/lib/mock-phase2";

export async function GET() {
  return NextResponse.json({ data: apiSetting });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  Object.assign(apiSetting, payload);
  return NextResponse.json({ data: apiSetting, message: "Lưu cấu hình API thành công" });
}
