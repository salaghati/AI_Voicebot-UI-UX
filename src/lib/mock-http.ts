import { NextRequest, NextResponse } from "next/server";
import { parseFilterParams } from "@/lib/query-utils";
import { sleep } from "@/lib/utils";

export type MockState = "loading" | "empty" | "error" | "forbidden" | "ready";

export function getMockState(request: NextRequest): MockState {
  const state = request.nextUrl.searchParams.get("state");
  if (state === "loading" || state === "empty" || state === "error" || state === "forbidden") {
    return state;
  }
  return "ready";
}

export async function guardMockState(request: NextRequest) {
  const state = getMockState(request);
  if (state === "loading") {
    await sleep(900);
    return null;
  }
  if (state === "error") {
    return NextResponse.json({ message: "Mô phỏng lỗi từ hệ thống" }, { status: 500 });
  }
  if (state === "forbidden") {
    return NextResponse.json({ message: "Bạn không có quyền truy cập màn hình này" }, { status: 403 });
  }
  return null;
}

export function getFilters(request: NextRequest) {
  return parseFilterParams(request.nextUrl.searchParams);
}
