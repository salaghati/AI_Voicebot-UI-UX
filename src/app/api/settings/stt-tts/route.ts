import { NextRequest, NextResponse } from "next/server";
import { sttTtsSetting } from "@/lib/mock-phase2";

export async function GET() {
  return NextResponse.json({ data: sttTtsSetting });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({ data: payload, message: "Lưu STT/TTS thành công" });
}
