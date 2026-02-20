import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const toneClass = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-sky-100 text-sky-700",
  muted: "bg-zinc-100 text-zinc-700",
  danger: "bg-red-100 text-red-700",
};

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof toneClass }) {
  return (
    <span
      className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", toneClass[tone], className)}
      {...props}
    />
  );
}
