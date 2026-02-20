import { NextRequest, NextResponse } from "next/server";
import { getWorkflowById, toggleWorkflowStatus, updateWorkflow } from "@/lib/mock-db";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getWorkflowById(id);
  if (!data) {
    return NextResponse.json({ message: "Không tìm thấy workflow" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json();
  const data = updateWorkflow(id, payload);

  if (!data) {
    return NextResponse.json({ message: "Không tìm thấy workflow" }, { status: 404 });
  }

  return NextResponse.json({ data, message: "Cập nhật workflow thành công" });
}

export async function PATCH(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = toggleWorkflowStatus(id);
  if (!data) {
    return NextResponse.json({ message: "Không tìm thấy workflow" }, { status: 404 });
  }
  return NextResponse.json({ data, message: `Workflow đã chuyển sang ${data.status}` });
}
