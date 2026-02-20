"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteKbFallbackRule, fetchKbFallbackRule, toggleKbFallbackActive } from "@/lib/api-client";
import { KbShell } from "./KbShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { AsyncState } from "@/components/shared/async-state";
import { formatDateTime } from "@/lib/utils";
import {
  labelKbFallbackCategory,
  labelKbFallbackFailAction,
  labelKbFallbackNextAction,
} from "./kb-fallback-meta";

export function KbFallbackDetailView({ fallbackId }: { fallbackId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleted, setDeleted] = useState(false);
  const query = useQuery({
    queryKey: ["kb-fallback", fallbackId],
    queryFn: () => fetchKbFallbackRule(fallbackId),
  });
  const toggleMutation = useMutation({
    mutationFn: toggleKbFallbackActive,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["kb-fallback", fallbackId] });
      queryClient.invalidateQueries({ queryKey: ["kb-fallback-list"] });
      toast.success(res.message ?? "Đã cập nhật trạng thái");
    },
    onError: () => toast.error("Không thể cập nhật trạng thái"),
  });

  if (query.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (query.isError) {
    return <AsyncState state="error" onRetry={() => query.refetch()} />;
  }

  const item = query.data?.data;

  if (deleted || !item) {
    return <AsyncState state="empty" message="Không tìm thấy KB fallback này." />;
  }

  return (
    <KbShell
      title="KB Fallback"
      description="Chi tiết fallback nghiệp vụ khi bot không match được intent hoặc không tìm được tri thức phù hợp."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/kb/fallback">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Về danh sách
            </Button>
          </Link>
          <Link href={`/kb/fallback/${item.id}/edit`}>
            <Button variant="secondary" className="gap-2">
              <Pencil className="h-4 w-4" /> Chỉnh sửa
            </Button>
          </Link>
          <Button
            variant="danger"
            className="gap-2"
            onClick={async () => {
              if (!window.confirm(`Xóa fallback ${item.id}?`)) {
                return;
              }
              await deleteKbFallbackRule(item.id);
              setDeleted(true);
              toast.success(`Đã xóa fallback ${item.id}`);
              router.push("/kb/fallback");
            }}
          >
            <Trash2 className="h-4 w-4" /> Xóa
          </Button>
        </div>
      }
    >
      <Card className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-3xl font-bold">{item.name}</h3>
            <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-sm font-medium text-[var(--text-dim)]">
              ID: {item.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              tone={
                item.status === "Đã học"
                  ? "success"
                  : item.status === "Đang học"
                    ? "info"
                    : "warning"
              }
            >
              {item.status.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-2">
              <ToggleSwitch
                checked={item.active}
                onChange={() => toggleMutation.mutate(item.id)}
                disabled={toggleMutation.isPending}
              />
              <span className={`text-sm font-semibold ${item.active ? "text-emerald-600" : "text-[var(--text-dim)]"}`}>
                {item.active ? "ACTIVE" : "OFF"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="mb-1 text-sm font-semibold">Tên fallback</p>
            <div className="rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-lg font-medium">{item.name}</div>
          </div>
          <div className="rounded-[22px] border border-[#d7deea] bg-[#f8fafc] p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-[var(--text-dim)]">STATUS</p>
                <p className="mt-2 text-xl font-semibold">{item.status}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-dim)]">ACTIVE</p>
                <div className="mt-2 flex items-center gap-2">
                  <ToggleSwitch
                    checked={item.active}
                    onChange={() => toggleMutation.mutate(item.id)}
                    disabled={toggleMutation.isPending}
                  />
                  <span className="text-xl font-semibold">{item.active ? "On" : "Off"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold">Category</p>
          <div className="rounded-xl border border-[var(--accent)] bg-white px-4 py-3 text-lg font-medium">
            {labelKbFallbackCategory(item.category)}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-semibold">Tin nhắn fallback</p>
            <div className="min-h-32 rounded-xl border border-[var(--line)] bg-white p-4 text-sm leading-6">
              {item.responseText}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold">Bản đọc thoại (TTS)</p>
            <div className="min-h-32 rounded-xl border border-[var(--line)] bg-white p-4 text-sm leading-6">
              {item.ttsText}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Next action</p>
          <div className="grid gap-3 xl:grid-cols-4">
            {["ASK_AGAIN", "END_CALL", "CALLBACK", "TRANSFER_AGENT"].map((action) => {
              const active = item.nextAction === action;
              return (
                <div
                  key={action}
                  className={`rounded-2xl border px-4 py-5 text-base font-medium ${
                    active ? "border-[var(--accent)] bg-sky-50 text-[var(--text-main)]" : "border-[var(--line)] bg-white text-[var(--text-dim)]"
                  }`}
                >
                  {labelKbFallbackNextAction(action as typeof item.nextAction)}
                </div>
              );
            })}
          </div>
        </div>

        {item.nextAction === "TRANSFER_AGENT" ? (
          <div className="rounded-2xl border-2 border-[var(--accent)] bg-[#f7fbff] p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-4 w-4 rounded-full border-4 border-[var(--accent)] border-offset-2" />
              <h4 className="text-2xl font-bold">Chuyển agent</h4>
              <span className="text-sm font-semibold text-[var(--text-dim)]">CONFIG OVERRIDES</span>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-4">
              <div>
                <p className="text-xs font-semibold text-[var(--text-dim)]">TARGET MODE</p>
                <p className="mt-2 text-lg font-medium">{item.targetMode === "OVERRIDE" ? "Override" : "Config sẵn"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-dim)]">TARGET QUEUE</p>
                <div className="mt-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-base font-medium">{item.targetQueue}</div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-dim)]">MAX WAIT (S)</p>
                <div className="mt-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-base font-medium">{item.maxWaitSec}</div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-dim)]">ON FAIL ACTION</p>
                <div className="mt-2 rounded-xl border border-[#ff7875] bg-white px-3 py-2 text-base font-medium text-[#9f1239]">
                  {labelKbFallbackFailAction(item.onFailAction)}
                </div>
              </div>
            </div>

            {item.onFailAction === "PLAY_ERROR_MESSAGE" ? (
              <div className="mt-4 rounded-xl border border-[#fecaca] bg-[#fff1f0] px-4 py-3 text-sm font-medium text-[#cf1322]">
                Error: Khi hàng chờ thất bại, hệ thống sẽ phát bản tin lỗi thay vì lặp chuyển tiếp.
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="text-sm text-[var(--text-dim)]">Cập nhật gần nhất: {formatDateTime(item.updatedAt)}</div>
      </Card>
    </KbShell>
  );
}
