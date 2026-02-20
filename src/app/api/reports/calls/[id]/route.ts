import { NextRequest, NextResponse } from "next/server";
import { getCallReport } from "@/lib/mock-db";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getCallReport(id);
  if (!data) {
    return NextResponse.json({ message: "Không tìm thấy cuộc gọi" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
