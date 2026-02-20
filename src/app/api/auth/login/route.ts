import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || "").toLowerCase();
  const password = String(body.password || "");

  if (email.includes("fail") || password === "wrong123") {
    return NextResponse.json({ message: "Sai email hoặc mật khẩu" }, { status: 401 });
  }

  return NextResponse.json({
    data: {
      token: "mock-token-voicebot",
      user: email,
    },
    message: "Đăng nhập thành công",
  });
}
