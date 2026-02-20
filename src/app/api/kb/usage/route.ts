import { NextResponse } from "next/server";
import { kbUsage } from "@/lib/mock-phase2";

export async function GET() {
  return NextResponse.json({ data: kbUsage });
}
