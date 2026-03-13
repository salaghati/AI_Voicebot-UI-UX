import { NextRequest, NextResponse } from "next/server";
import { agentSetting } from "@/lib/mock-phase2";

export async function GET() {
  return NextResponse.json({ data: agentSetting });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  Object.assign(agentSetting, payload);
  return NextResponse.json({ data: agentSetting, message: "Lưu cấu hình Agent thành công" });
}
