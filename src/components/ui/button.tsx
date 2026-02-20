import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_4px_12px_rgba(24,144,255,0.25)] hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)] active:border-[var(--accent-active)] active:bg-[var(--accent-active)] focus-visible:ring-[rgba(24,144,255,0.35)]",
        secondary:
          "border-[#d9d9d9] bg-white text-[var(--text-main)] hover:border-[var(--accent-hover)] hover:text-[var(--accent)] focus-visible:ring-[rgba(24,144,255,0.25)]",
        ghost: "border-transparent bg-transparent text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--text-main)] focus-visible:ring-[rgba(24,144,255,0.25)]",
        danger: "border-[#ff4d4f] bg-[#ff4d4f] text-white hover:border-[#ff7875] hover:bg-[#ff7875] focus-visible:ring-[rgba(255,77,79,0.28)]",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4",
        lg: "h-10 px-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
