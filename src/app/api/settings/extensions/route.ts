import { NextRequest, NextResponse } from "next/server";
import { extensions } from "@/lib/mock-phase2";

export async function GET() {
  return NextResponse.json({ data: extensions });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({ data: payload, message: "Thêm extension thành công" }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({ data: payload, message: "Cập nhật extension thành công" });
}

export async function DELETE() {
  return NextResponse.json({ data: { success: true }, message: "Xóa extension thành công" });
}
