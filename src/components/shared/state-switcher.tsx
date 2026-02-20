"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const states = [
  { value: "ready", label: "Normal" },
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Empty" },
  { value: "error", label: "Error" },
  { value: "forbidden", label: "No Permission" },
];

export function StateSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("state") || "ready";

  const updateState = (state: string) => {
    const next = new URLSearchParams(params.toString());
    if (state === "ready") {
      next.delete("state");
    } else {
      next.set("state", state);
    }
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-[var(--text-dim)]">Mô phỏng trạng thái</span>
      {states.map((item) => (
        <button key={item.value} type="button" onClick={() => updateState(item.value)}>
          <Badge className={cn(current === item.value ? "ring-2 ring-[var(--accent)] ring-offset-1" : "opacity-70")}>{item.label}</Badge>
        </button>
      ))}
    </div>
  );
}
