import { NextRequest, NextResponse } from "next/server";
import { listErrorMetrics } from "@/lib/mock-db";
import { guardMockState } from "@/lib/mock-http";

export async function GET(request: NextRequest) {
  const guarded = await guardMockState(request);
  if (guarded) {
    return guarded;
  }

  return NextResponse.json({ data: listErrorMetrics() });
}
