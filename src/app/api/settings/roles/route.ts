import { NextRequest, NextResponse } from "next/server";
import { roles } from "@/lib/mock-phase2";

export async function GET() {
  return NextResponse.json({ data: roles });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({ data: payload, message: "Tạo phân quyền thành công" }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({ data: payload, message: "Cập nhật phân quyền thành công" });
}

export async function DELETE() {
  return NextResponse.json({ data: { success: true }, message: "Xóa phân quyền thành công" });
}
