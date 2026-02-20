"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsLinks = [
  { label: "1. STT/TTS", href: "/settings/stt-tts" },
  { label: "2. DS Người dùng", href: "/settings/users" },
  { label: "2.1 Thêm User", href: "/settings/users/new" },
  { label: "3. API", href: "/settings/api" },
  { label: "4. Agent", href: "/settings/agent" },
  { label: "4.1 Thêm hàng chờ", href: "/settings/agent/queue-new" },
  { label: "5. Fallback", href: "/settings/fallback" },
  { label: "5.1 Fallback dropdown", href: "/settings/fallback/dropdown" },
  { label: "6. Quản lý đầu số", href: "/settings/phone-numbers" },
  { label: "7. Quản lý extension", href: "/settings/extensions" },
  { label: "8. DS phân quyền", href: "/settings/roles" },
  { label: "8.1 Tạo/sửa phân quyền", href: "/settings/roles/editor" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {settingsLinks.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-xl border px-3 py-2 text-sm transition",
              active
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--line)] bg-white text-[var(--text-dim)] hover:bg-[var(--surface-2)]",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
