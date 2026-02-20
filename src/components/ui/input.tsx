import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--accent)] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.18)]",
        className,
      )}
      {...props}
    />
  );
}
