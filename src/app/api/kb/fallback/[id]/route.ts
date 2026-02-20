import { NextRequest, NextResponse } from "next/server";
import {
  deleteKbFallbackRule,
  getKbFallbackRuleById,
  toggleKbFallbackActive,
  updateKbFallbackRule,
} from "@/lib/mock-phase2";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getKbFallbackRuleById(id);

  if (!data) {
    return NextResponse.json({ message: "Không tìm thấy KB fallback" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json();
  const data = updateKbFallbackRule(id, payload);

  if (!data) {
    return NextResponse.json({ message: "Không tìm thấy KB fallback" }, { status: 404 });
  }

  return NextResponse.json({ data, message: "Cập nhật KB fallback thành công" });
}

export async function PATCH(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = toggleKbFallbackActive(id);
  if (!data) {
    return NextResponse.json({ message: "Không tìm thấy KB fallback" }, { status: 404 });
  }
  return NextResponse.json({ data, message: `KB Fallback đã chuyển sang ${data.active ? "Active" : "Off"}` });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const success = deleteKbFallbackRule(id);

  if (!success) {
    return NextResponse.json({ message: "Không tìm thấy KB fallback" }, { status: 404 });
  }

  return NextResponse.json({ data: { success: true }, message: "Xóa KB fallback thành công" });
}
