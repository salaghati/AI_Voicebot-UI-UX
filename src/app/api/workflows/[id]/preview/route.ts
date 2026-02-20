import { NextRequest, NextResponse } from "next/server";
import { getWorkflowPreview } from "@/lib/mock-db";
import { guardMockState } from "@/lib/mock-http";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guarded = await guardMockState(request);
  if (guarded) {
    return guarded;
  }

  const { id } = await params;
  const tab = request.nextUrl.searchParams.get("tab") || "session";
  const nodeId = request.nextUrl.searchParams.get("nodeId") || undefined;
  const data = getWorkflowPreview(id, tab, nodeId);
  return NextResponse.json({ data });
}
