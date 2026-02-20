import { NextRequest, NextResponse } from "next/server";
import { phoneNumbers } from "@/lib/mock-phase2";

export async function GET() {
  return NextResponse.json({ data: phoneNumbers });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({ data: payload, message: "Thêm đầu số thành công" }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({ data: payload, message: "Cập nhật đầu số thành công" });
}

export async function DELETE() {
  return NextResponse.json({ data: { success: true }, message: "Xóa đầu số thành công" });
}
