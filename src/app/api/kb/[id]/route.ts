import { NextRequest, NextResponse } from "next/server";
import { deleteMockKbDoc, getKbDocById, updateMockKbDoc } from "@/lib/mock-phase2";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getKbDocById(id);

  if (!data) {
    return NextResponse.json({ message: "Không tìm thấy KB" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json();
  const data = updateMockKbDoc(id, payload);

  if (!data) {
    return NextResponse.json({ message: "Không tìm thấy KB" }, { status: 404 });
  }

  return NextResponse.json({ data, message: "Cập nhật KB thành công" });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const success = deleteMockKbDoc(id);

  if (!success) {
    return NextResponse.json({ message: "Không tìm thấy KB" }, { status: 404 });
  }

  return NextResponse.json({ data: { success: true }, message: "Xóa KB thành công" });
}
