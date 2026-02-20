"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchKbUsage } from "@/lib/api-client";
import { KbShell } from "@/features/kb";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function KbUsageFilterPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const query = useQuery({ queryKey: ["kb-usage-filter"], queryFn: () => fetchKbUsage() });

  const filters = useMemo(
    () => ({
      kb: params.get("kb") || "",
      wf: params.get("wf") || "",
      search: params.get("search") || "",
    }),
    [params],
  );

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  };

  const items = (query.data?.data || []).filter((item) => {
    if (filters.kb && item.kbId !== filters.kb) return false;
    if (filters.wf && item.workflow !== filters.wf) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return [item.id, item.kbId, item.workflow, item.topIntent].some((field) =>
        field.toLowerCase().includes(q),
      );
    }
    return true;
  });

  return (
    <KbShell
      title="KB - 3.0 Truy vết sử dụng (Filter)"
      description="Filter theo KB, workflow, và thời gian (mô phỏng)"
    >
      <Card className="grid gap-3 md:grid-cols-3">
        <Select value={filters.kb} onChange={(event) => setParam("kb", event.target.value)}>
          <option value="">Filter KB</option>
          <option value="KB-100">KB-100</option>
          <option value="KB-101">KB-101</option>
        </Select>

        <Select value={filters.wf} onChange={(event) => setParam("wf", event.target.value)}>
          <option value="">Filter Workflow</option>
          <option value="WF_ThuNo_A">WF_ThuNo_A</option>
          <option value="WF_CrossSell_B">WF_CrossSell_B</option>
        </Select>

        <Input
          placeholder="Filter thời gian / keyword"
          value={filters.search}
          onChange={(event) => setParam("search", event.target.value)}
        />
      </Card>

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id} className="space-y-1">
            <p className="text-sm text-[var(--text-dim)]">{item.id}</p>
            <p className="font-semibold">{item.kbId} • {item.workflow}</p>
            <p className="text-sm">{item.calls} cuộc gọi • Top intent: {item.topIntent}</p>
          </Card>
        ))}
      </div>
    </KbShell>
  );
}
