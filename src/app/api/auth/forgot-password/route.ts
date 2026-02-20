import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.email) {
    return NextResponse.json({ message: "Email bắt buộc" }, { status: 400 });
  }

  return NextResponse.json({
    data: { sent: true },
    message: "Đã gửi OTP xác thực về email",
  });
}
