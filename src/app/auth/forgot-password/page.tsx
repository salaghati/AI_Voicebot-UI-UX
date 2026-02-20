"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/lib/validators";
import { forgotPassword } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ForgotValues = { email: string };

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotValues) => {
    try {
      await forgotPassword(values);
      toast.success("Đã gửi OTP qua email");
    } catch {
      toast.error("Không thể gửi OTP");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_16%_10%,rgba(14,116,144,0.14),transparent_38%),#eef4f9] p-6">
      <Card className="w-full max-w-md border-[#c7d5e2] bg-white p-8 shadow-[0_20px_55px_rgba(20,47,84,0.14)]">
        <h1 className="text-2xl font-bold text-[#12304f]">Quên mật khẩu</h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          Nhập email để nhận OTP xác thực và đặt lại mật khẩu.
        </p>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium">Email đăng nhập</label>
            <Input {...register("email")} placeholder="admin@voicebot.vn" />
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
          </div>
          <Button disabled={isSubmitting} className="w-full" type="submit">
            {isSubmitting ? "Đang gửi..." : "Gửi OTP"}
          </Button>
          <Link href="/auth/login" className="block text-center text-sm text-[var(--accent)] underline-offset-4 hover:underline">
            Quay lại đăng nhập
          </Link>
        </form>
      </Card>
    </main>
  );
}
