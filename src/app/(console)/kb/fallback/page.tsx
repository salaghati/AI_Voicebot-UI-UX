"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { fetchKbFallbackRules, toggleKbFallbackActive } from "@/lib/api-client";
import { KbShell, labelKbFallbackCategory, labelKbFallbackNextAction } from "@/features/kb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AsyncState } from "@/components/shared/async-state";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { formatDateTime } from "@/lib/utils";

export default function KbFallbackPage() {
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["kb-fallback-list"], queryFn: fetchKbFallbackRules });
  const toggleMutation = useMutation({
    mutationFn: toggleKbFallbackActive,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["kb-fallback-list"] });
      toast.success(res.message ?? "Đã cập nhật trạng thái");
    },
    onError: () => toast.error("Không thể cập nhật trạng thái"),
  });
  const items = useMemo(
    () => (query.data?.data ?? []).filter((item) => !hiddenIds.includes(item.id)),
    [hiddenIds, query.data?.data],
  );

  return (
    <KbShell
      title="KB Fallback"
      description="Danh sách fallback nghiệp vụ khi bot không tìm được intent phù hợp hoặc KB match thấp."
      actions={
        <Link href="/kb/fallback/actions">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Thêm fallback
          </Button>
        </Link>
      }
    >
      {query.isLoading ? <AsyncState state="loading" /> : null}
      {query.isError ? <AsyncState state="error" onRetry={() => query.refetch()} /> : null}
      {!query.isLoading && !query.isError && items.length === 0 ? <AsyncState state="empty" /> : null}
      {!query.isLoading && !query.isError && items.length > 0 ? (
        <Card>
          <Table>
            <THead>
              <tr>
                <TH>ID</TH>
                <TH>Tên fallback</TH>
                <TH>Category</TH>
                <TH>Next action</TH>
                <TH>Trạng thái</TH>
                <TH>Active</TH>
                <TH>Cập nhật</TH>
                <TH className="text-right">Thao tác</TH>
              </tr>
            </THead>
            <TBody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--surface-2)]">
                  <TD>{item.id}</TD>
                  <TD className="font-medium">
                    <Link href={`/kb/fallback/${item.id}`} className="hover:text-[var(--accent)]">
                      {item.name}
                    </Link>
                  </TD>
                  <TD>{labelKbFallbackCategory(item.category)}</TD>
                  <TD>{labelKbFallbackNextAction(item.nextAction)}</TD>
                  <TD>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        tone={
                          item.status === "Đã học"
                            ? "success"
                            : item.status === "Đang học"
                              ? "info"
                              : "warning"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <ToggleSwitch
                        checked={item.active}
                        onChange={() => toggleMutation.mutate(item.id)}
                        disabled={toggleMutation.isPending}
                      />
                      <span className={`text-xs font-medium ${item.active ? "text-emerald-600" : "text-[var(--text-dim)]"}`}>
                        {item.active ? "On" : "Off"}
                      </span>
                    </div>
                  </TD>
                  <TD>{formatDateTime(item.updatedAt)}</TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/kb/fallback/${item.id}`}>
                        <Button variant="ghost" size="sm" title="Xem">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/kb/fallback/${item.id}/edit`}>
                        <Button variant="ghost" size="sm" title="Sửa">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Xóa"
                        onClick={() => {
                          if (!window.confirm(`Xóa fallback ${item.id}?`)) {
                            return;
                          }
                          setHiddenIds((prev) => [...prev, item.id]);
                          toast.success(`Đã xóa fallback ${item.id} (mock)`);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TD>
                </tr>
              ))}
            </TBody>
          </Table>
        </Card>
      ) : null}
    </KbShell>
  );
}
