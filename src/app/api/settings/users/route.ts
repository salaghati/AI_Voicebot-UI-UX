import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/mock-phase2";

export async function GET() {
  return NextResponse.json({ data: users });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({ data: payload, message: "Thêm user thành công" }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({ data: payload, message: "Cập nhật user thành công" });
}

export async function DELETE() {
  return NextResponse.json({ data: { success: true }, message: "Xóa user thành công" });
}
