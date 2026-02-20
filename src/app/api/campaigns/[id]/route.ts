import { NextRequest, NextResponse } from "next/server";
import { getCampaignById } from "@/lib/mock-db";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getCampaignById(id);
  if (!data) {
    return NextResponse.json({ message: "Không tìm thấy chiến dịch" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
