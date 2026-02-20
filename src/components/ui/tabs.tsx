"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TabItem {
  label: string;
  href: string;
  active?: boolean;
}

export function TabsNav({ items }: { items: TabItem[] }) {
  return (
    <div className="inline-flex rounded-lg border border-[var(--line)] bg-white p-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-md border border-transparent px-3 py-1.5 text-sm transition",
            item.active
              ? "border-[var(--accent)] bg-[var(--accent)] text-white"
              : "text-[var(--text-dim)] hover:border-[#d9d9d9] hover:bg-[var(--surface-2)]",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
