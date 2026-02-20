"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteKbDoc, fetchKbDoc } from "@/lib/api-client";
import { KbShell } from "./KbShell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/shared/async-state";
import { formatDateTime } from "@/lib/utils";

export function KbDetailView({ kbId }: { kbId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["kb-doc", kbId], queryFn: () => fetchKbDoc(kbId) });
  const item = query.data?.data ?? null;

  const removeMutation = useMutation({
    mutationFn: () => deleteKbDoc(kbId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["kb-list"] });
      toast.success(`Đã xóa ${kbId}`);
      router.push("/kb/list");
    },
    onError: () => toast.error("Không thể xóa KB"),
  });

  if (query.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (query.isError) {
    return <AsyncState state="error" onRetry={() => query.refetch()} />;
  }

  if (!item) {
    return <AsyncState state="empty" message="Không tìm thấy KB này." />;
  }

  const sourceContent =
    item.sourceType === "url" ? (
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">URL nguồn</p>
          <p className="mt-2 text-sm text-[var(--text-main)]">{item.url || "-"}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">Crawl mode</p>
            <p className="mt-2 text-sm text-[var(--text-main)]">{item.crawlMode || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">Page limit</p>
            <p className="mt-2 text-sm text-[var(--text-main)]">{item.pageLimit || "-"}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">Patterns</p>
          <p className="mt-2 text-sm text-[var(--text-main)]">{item.patterns || "Chưa cấu hình"}</p>
        </div>
      </div>
    ) : item.sourceType === "article" ? (
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">Tiêu đề bài viết</p>
          <p className="mt-2 text-sm text-[var(--text-main)]">{item.articleTitle || item.title}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">Nội dung</p>
          <div className="mt-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--text-main)]">
            {item.articleContent || "Chưa có nội dung."}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">Tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(item.articleTags || []).map((tag) => (
              <Badge key={tag} tone="info">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">File đã tải lên</p>
          <p className="mt-2 text-sm text-[var(--text-main)]">{item.fileName || "-"}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">Định dạng file</p>
            <p className="mt-2 text-sm text-[var(--text-main)]">{item.fileTypes || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-dim)]">Chunking mode</p>
            <p className="mt-2 text-sm text-[var(--text-main)]">{item.chunkingMode || "-"}</p>
          </div>
        </div>
      </div>
    );

  return (
    <KbShell
      title={item.title}
      description="Xem chi tiết nguồn tri thức, nội dung đã cấu hình và trạng thái học hiện tại."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/kb/list">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Về danh sách
            </Button>
          </Link>
          {item.status !== "Đã học" ? (
            <Link href={`/kb/list/${item.id}/edit`}>
              <Button variant="secondary" className="gap-2">
                <Pencil className="h-4 w-4" /> Sửa KB
              </Button>
            </Link>
          ) : null}
          <Button
            variant="danger"
            className="gap-2"
            disabled={removeMutation.isPending}
            onClick={() => {
              if (!window.confirm(`Xóa KB ${item.id}?`)) {
                return;
              }
              removeMutation.mutate();
            }}
          >
            <Trash2 className="h-4 w-4" /> Xóa
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-4 rounded-3xl">
          {sourceContent}
        </Card>

        <Card className="space-y-3 rounded-3xl">
          <h3 className="text-base font-bold">Thông tin tài liệu</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[var(--text-dim)]">Mã KB</span>
              <span className="font-medium">{item.id}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[var(--text-dim)]">Nguồn</span>
              <span className="font-medium">{item.source}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[var(--text-dim)]">Trạng thái</span>
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
            <div className="flex items-center justify-between gap-3">
              <span className="text-[var(--text-dim)]">Version</span>
              <span className="font-medium">{item.version}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[var(--text-dim)]">Cập nhật</span>
              <span className="font-medium">{formatDateTime(item.updatedAt)}</span>
            </div>
          </div>
        </Card>
      </div>
    </KbShell>
  );
}
