"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Brain, Download, Eye, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteKbDoc, fetchKbDocs, updateKbDoc } from "@/lib/api-client";
import { KbShell } from "@/features/kb";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/shared/async-state";
import { formatDateTime } from "@/lib/utils";

function bumpVersion(version: string) {
  const current = Number(version.replace(/[^\d]/g, "")) || 1;
  return `v${current + 1}`;
}

export default function KbListPage() {
  const queryClient = useQueryClient();
  const [learningIds, setLearningIds] = useState<string[]>([]);
  const query = useQuery({ queryKey: ["kb-list"], queryFn: () => fetchKbDocs() });

  const learnMutation = useMutation({
    mutationFn: ({ id, version }: { id: string; version: string }) =>
      updateKbDoc(id, { status: "Đã học", version: bumpVersion(version) }),
    onSuccess: async (_, variables) => {
      setLearningIds((prev) => prev.filter((item) => item !== variables.id));
      await queryClient.invalidateQueries({ queryKey: ["kb-list"] });
      toast.success(`Đã học xong ${variables.id}`);
    },
    onError: (_, variables) => {
      setLearningIds((prev) => prev.filter((item) => item !== variables.id));
      toast.error(`Không thể học ${variables.id}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteKbDoc(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ["kb-list"] });
      toast.success(`Đã xóa ${id}`);
    },
    onError: () => toast.error("Không thể xóa KB"),
  });

  const visibleItems = useMemo(() => query.data?.data ?? [], [query.data?.data]);

  return (
    <KbShell
      title="Danh sách KB"
      description="KB chưa học sẽ có mắt, não và thùng rác. KB đã học chỉ còn mắt và thùng rác."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Link href="/kb/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Tạo mới KB
            </Button>
          </Link>
        </div>
      }
    >
      {query.isLoading ? <AsyncState state="loading" /> : null}
      {query.isError ? <AsyncState state="error" onRetry={() => query.refetch()} /> : null}
      {!query.isLoading && !query.isError && visibleItems.length === 0 ? <AsyncState state="empty" /> : null}
      {!query.isLoading && !query.isError && visibleItems.length > 0 ? (
        <Card className="rounded-3xl">
          <Table>
            <THead>
              <tr>
                <TH>Mã KB</TH>
                <TH>Tiêu đề</TH>
                <TH>Nguồn</TH>
                <TH>Trạng thái</TH>
                <TH>Version</TH>
                <TH>Cập nhật</TH>
                <TH className="text-right">Thao tác</TH>
              </tr>
            </THead>
            <TBody>
              {visibleItems.map((item) => {
                const isLearning = learningIds.includes(item.id) || item.status === "Đang học";
                const statusLabel = isLearning ? "Đang học" : item.status;
                const statusTone =
                  statusLabel === "Đã học"
                    ? "success"
                    : statusLabel === "Đang học"
                      ? "info"
                      : "warning";

                return (
                  <tr key={item.id} className="hover:bg-[var(--surface-2)]">
                    <TD>{item.id}</TD>
                    <TD className="font-medium">
                      <Link
                        href={`/kb/list/${item.id}`}
                        className="text-[var(--text-main)] hover:text-[var(--accent)]"
                      >
                        {item.title}
                      </Link>
                    </TD>
                    <TD>{item.source}</TD>
                    <TD>
                      <Badge tone={statusTone} className="gap-1.5">
                        {statusLabel === "Đang học" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : null}
                        {statusLabel}
                      </Badge>
                    </TD>
                    <TD>{item.version}</TD>
                    <TD>{formatDateTime(item.updatedAt)}</TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/kb/list/${item.id}`}>
                          <Button variant="ghost" size="sm" title="Xem">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        {statusLabel === "Đã học" ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Xóa"
                              disabled={deleteMutation.isPending}
                              onClick={() => {
                                if (!window.confirm(`Xóa KB ${item.id}?`)) {
                                  return;
                                }
                                deleteMutation.mutate(item.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        ) : null}

                        {statusLabel === "Chưa học" ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Học KB"
                              onClick={() => {
                                setLearningIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
                                window.setTimeout(() => {
                                  learnMutation.mutate({ id: item.id, version: item.version });
                                }, 1600);
                              }}
                            >
                              <Brain className="h-4 w-4 text-[var(--accent)]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Xóa"
                              disabled={deleteMutation.isPending}
                              onClick={() => {
                                if (!window.confirm(`Xóa KB ${item.id}?`)) {
                                  return;
                                }
                                deleteMutation.mutate(item.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        ) : null}

                        {statusLabel === "Đang học" ? (
                          <>
                            <Button variant="ghost" size="sm" title="Đang học" disabled>
                              <LoaderCircle className="h-4 w-4 animate-spin text-[var(--accent)]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Xóa"
                              disabled={deleteMutation.isPending}
                              onClick={() => {
                                if (!window.confirm(`Xóa KB ${item.id}?`)) {
                                  return;
                                }
                                deleteMutation.mutate(item.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TD>
                  </tr>
                );
              })}
            </TBody>
          </Table>
        </Card>
      ) : null}
    </KbShell>
  );
}
