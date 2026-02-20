"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileCode2, MoreVertical, Plus, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchWorkflows, toggleWorkflowStatus } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AsyncState } from "@/components/shared/async-state";
import { formatDateTime } from "@/lib/utils";
import { mapStatusTone } from "@/lib/mappers";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import type { Workflow } from "@/types/domain";

export default function WorkflowListPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Tất cả" | "Active" | "Draft">("Tất cả");
  const [typeFilter, setTypeFilter] = useState<"Tất cả" | "Inbound" | "Outbound" | "Playground">("Tất cả");
  const [menuId, setMenuId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["workflows", { page: 1, pageSize: 50 }],
    queryFn: () => fetchWorkflows({ page: 1, pageSize: 50 }),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleWorkflowStatus,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success(`Workflow đã chuyển sang ${result.data.status}`);
    },
    onError: () => toast.error("Không thể đổi trạng thái workflow"),
  });

  const workflows = listQuery.data?.data.items ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workflows.filter((item: Workflow) => {
      const matchQ = !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "Tất cả" || item.status === statusFilter;
      const matchType = typeFilter === "Tất cả" || item.kind === typeFilter;
      return matchQ && matchStatus && matchType;
    });
  }, [workflows, query, statusFilter, typeFilter]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Workflows"
        description="Quản lý workflow, bật/tắt trạng thái và tạo mới."
      />

      <Card className="grid gap-3 md:grid-cols-[150px_180px_1fr]">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
          <option value="Tất cả">Tất cả status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
        </Select>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}>
          <option value="Tất cả">Tất cả loại</option>
          <option value="Inbound">Inbound</option>
          <option value="Outbound">Outbound</option>
          <option value="Playground">Playground</option>
        </Select>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--text-dim)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm workflow..."
            className="pl-9"
          />
        </div>
      </Card>

      {listQuery.isLoading ? <AsyncState state="loading" /> : null}
      {listQuery.isError ? <AsyncState state="error" onRetry={() => listQuery.refetch()} /> : null}

      {!listQuery.isLoading && !listQuery.isError ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link href="/workflow/new" className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--line)] bg-white p-6 text-center transition hover:border-[var(--accent)] hover:bg-[rgba(24,144,255,0.04)]">
            <div className="rounded-full bg-[var(--surface-2)] p-3">
              <Plus className="h-6 w-6 text-[var(--accent)]" />
            </div>
            <p className="text-sm font-semibold">Create new workflow</p>
            <p className="text-xs text-[var(--text-dim)]">Start building your automated workflow</p>
          </Link>

          {filtered.map((item: Workflow) => (
            <Card key={item.id} className="relative flex min-h-[220px] flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-[#eef4ff] p-2 text-[#2f80ed]">
                    <FileCode2 className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-dim)]">
                      {item.status === "Active" ? "Active" : "Activate"}
                    </span>
                    <ToggleSwitch
                      checked={item.status === "Active"}
                      onChange={() => toggleMutation.mutate(item.id)}
                    />
                    <button
                      type="button"
                      onClick={() => setMenuId((prev) => (prev === item.id ? null : item.id))}
                      className="rounded-md p-1 text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <Badge tone={item.status === "Active" ? "success" : "muted"}>
                    {item.status === "Active" ? "PUBLIC" : "DRAFT"}
                  </Badge>
                </div>

                <Link
                  href={`/workflow/${item.id}`}
                  className="mt-2 block text-lg font-semibold leading-tight text-[var(--text-main)] hover:text-[var(--accent)]"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-[var(--text-dim)]">{item.kind}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-xs text-[var(--text-dim)]">
                <span>Version: {item.version}</span>
                <span>{formatDateTime(item.updatedAt)}</span>
              </div>

              {menuId === item.id ? (
                <div className="absolute right-4 top-12 z-20 w-44 rounded-xl border border-[var(--line)] bg-white p-1 shadow-xl">
                  <Link
                    href={`/workflow/${item.id}`}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface-2)]"
                    onClick={() => setMenuId(null)}
                  >
                    Xem chi tiết
                  </Link>
                  <Link
                    href={`/workflow/${item.id}/edit`}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface-2)]"
                    onClick={() => setMenuId(null)}
                  >
                    Chỉnh sửa
                  </Link>
                  <Link
                    href={`/workflow/${item.id}/preview/session`}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface-2)]"
                    onClick={() => setMenuId(null)}
                  >
                    Preview
                  </Link>
                  <button
                    type="button"
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                    onClick={() => {
                      toast.success("Đã xóa workflow (mock)");
                      setMenuId(null);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              ) : null}
            </Card>
          ))}
        </section>
      ) : null}

      {!listQuery.isLoading && !listQuery.isError && filtered.length === 0 ? (
        <Card className="text-center text-sm text-[var(--text-dim)]">Không có workflow phù hợp bộ lọc.</Card>
      ) : null}
    </div>
  );
}
