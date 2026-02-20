"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bot, MoreVertical, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import {
  getKnowledgeRef,
  getWorkflowRef,
  inboundRoutesMock,
  type InboundRoutePreview,
  type InboundStatus,
} from "@/features/platform-review/mock";

const statusOptions: Array<InboundStatus | "Tất cả"> = ["Tất cả", "Hoạt động", "Nháp", "Tạm dừng"];

function toneByStatus(status: InboundStatus) {
  if (status === "Hoạt động") return "success" as const;
  if (status === "Nháp") return "warning" as const;
  return "muted" as const;
}

export default function InboundReviewPage() {
  const [rows, setRows] = useState<InboundRoutePreview[]>(inboundRoutesMock);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("Tất cả");
  const [sort, setSort] = useState("updated-desc");
  const [menuId, setMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = rows.filter((item) => {
      const wf = getWorkflowRef(item.workflowId);
      const kb = getKnowledgeRef(item.kbId);
      const matchQ =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.queue.toLowerCase().includes(q) ||
        wf?.name.toLowerCase().includes(q) ||
        kb?.title.toLowerCase().includes(q);
      const matchStatus = status === "Tất cả" ? true : item.status === status;
      return matchQ && matchStatus;
    });

    if (sort === "updated-desc") {
      next = [...next].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sort === "name-asc") {
      next = [...next].sort((a, b) => a.name.localeCompare(b.name));
    }

    return next;
  }, [rows, query, sort, status]);

  const toggleStatus = (id: string) => {
    setRows((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus: InboundStatus =
          item.status === "Hoạt động" ? "Tạm dừng" : item.status === "Tạm dừng" ? "Hoạt động" : item.status;
        return {
          ...item,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Inbound Routes"
        description="Card grid theo pattern chatbot manager."
        actions={
          <Link href="/preview/platform-review/inbound/create">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Create New Inbound</Button>
          </Link>
        }
      />

      <Card className="grid gap-3 md:grid-cols-[170px_220px_1fr]">
        <Select value={status} onChange={(event) => setStatus(event.target.value as (typeof statusOptions)[number])}>
          {statusOptions.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <Select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="updated-desc">Updated date - New to Old</option>
          <option value="name-asc">Name A-Z</option>
        </Select>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--text-dim)]" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search inbound routes..."
            className="pl-9"
          />
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((item) => {
          const workflow = getWorkflowRef(item.workflowId);
          const knowledge = getKnowledgeRef(item.kbId);

          return (
            <Card key={item.id} className="relative flex min-h-[280px] flex-col justify-between p-4">
              <div>
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-[#eef4ff] p-2 text-[#2f80ed]">
                    <Bot className="h-5 w-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setMenuId((prev) => (prev === item.id ? null : item.id))}
                    className="rounded-md p-1 text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3">
                  <Badge tone={toneByStatus(item.status)}>{item.status}</Badge>
                </div>

                <Link href={`/preview/platform-review/inbound/${item.id}`} className="mt-3 block text-[28px] leading-tight font-semibold text-[var(--text-main)] hover:text-[var(--accent)]">
                  {item.name}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--text-dim)]">{item.description}</p>

                <div className="mt-3 grid gap-1.5 text-sm">
                  <p className="text-[var(--text-dim)]">
                    Workflow: {" "}
                    <Link href={`/preview/platform-review/workflows/${item.workflowId}`} className="font-medium text-[var(--accent)] hover:underline">
                      {workflow?.name || item.workflowId}
                    </Link>
                  </p>
                  <p className="text-[var(--text-dim)]">
                    Knowledge: {" "}
                    <Link href={`/preview/platform-review/kb/${item.kbId}`} className="font-medium text-[var(--accent)] hover:underline">
                      {knowledge?.title || item.kbId}
                    </Link>
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-[var(--text-dim)]">
                  <span>{item.queue}</span>
                  <span>Ext. {item.extension}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-[var(--line)] pt-3 text-xs text-[var(--text-dim)]">
                Updated: {formatDateTime(item.updatedAt)}
              </div>

              {menuId === item.id ? (
                <div className="absolute right-4 top-10 z-20 w-48 rounded-xl border border-[var(--line)] bg-white p-1 shadow-xl">
                  <Link href={`/preview/platform-review/inbound/${item.id}`} className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface-2)]">
                    Xem chi tiết
                  </Link>
                  <button
                    type="button"
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--surface-2)]"
                    onClick={() => {
                      toggleStatus(item.id);
                      toast.success("Đã đổi trạng thái route (mock)");
                      setMenuId(null);
                    }}
                  >
                    {item.status === "Hoạt động" ? "Tạm dừng" : "Kích hoạt"}
                  </button>
                  <button
                    type="button"
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                    onClick={() => {
                      setRows((prev) => prev.filter((row) => row.id !== item.id));
                      toast.success("Đã xóa route (mock)");
                      setMenuId(null);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              ) : null}
            </Card>
          );
        })}
      </section>

      {filtered.length === 0 ? (
        <Card className="text-center text-sm text-[var(--text-dim)]">Không có inbound route phù hợp bộ lọc.</Card>
      ) : null}
    </div>
  );
}
