"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validators";
import { login } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type LoginValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const failed = search.get("failed") === "1";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@voicebot.vn",
      password: "123456",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values);
      toast.success("Đăng nhập thành công");
      router.push("/dashboard");
    } catch {
      toast.error("Đăng nhập thất bại");
      router.push("/auth/login?failed=1");
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Module 01</p>
      <h1 className="mt-2 text-3xl font-bold">Đăng nhập hệ thống</h1>
      <p className="mt-2 text-sm text-[var(--text-dim)]">Nhập email và mật khẩu để truy cập hệ thống.</p>

      {failed ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Login Failed: Hệ thống báo lỗi khi nhập sai tài khoản hoặc mật khẩu.
        </div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1 block text-sm font-medium">Nhập email</label>
          <Input {...register("email")} placeholder="you@company.com" />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Nhập password</label>
          <Input type="password" {...register("password")} placeholder="******" />
          {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
        </div>

        <div className="flex items-center justify-between">
          <Link href="/auth/forgot-password" className="text-sm text-[var(--accent)] underline-offset-4 hover:underline">
            Quên mật khẩu
          </Link>
          <button
            type="button"
            className="text-sm text-[var(--text-dim)] underline-offset-4 hover:underline"
            onClick={() => router.push("/auth/login?failed=1")}
          >
            Demo lỗi đăng nhập
          </button>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </form>
    </Card>
  );
}
