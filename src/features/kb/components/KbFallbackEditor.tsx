"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createKbFallbackRule,
  fetchKbFallbackRule,
  updateKbFallbackRule,
} from "@/lib/api-client";
import { KbShell } from "./KbShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AsyncState } from "@/components/shared/async-state";
import {
  kbFallbackCategoryOptions,
  kbFallbackFailActions,
  kbFallbackNextActions,
  kbFallbackQueueOptions,
} from "./kb-fallback-meta";
import type { KbFallbackRule } from "@/types/domain";

type KbFallbackFormValues = Omit<KbFallbackRule, "id" | "updatedAt">;

const defaultValues: KbFallbackFormValues = {
  name: "Default Unknown Intent",
  category: "NLU_NO_MATCH",
  status: "Chưa học",
  active: true,
  responseText: "Xin lỗi, tôi chưa hiểu rõ yêu cầu của anh/chị. Anh/chị có thể nói lại theo cách khác được không ạ?",
  ttsText: "Xin lỗi, tôi chưa hiểu rõ yêu cầu của anh chị. Anh chị có thể nói lại theo cách khác được không ạ?",
  nextAction: "TRANSFER_AGENT",
  targetMode: "OVERRIDE",
  targetQueue: "Queue: Level 1 Support",
  maxWaitSec: 60,
  onFailAction: "PLAY_ERROR_MESSAGE",
};

export function KbFallbackEditor({ fallbackId }: { fallbackId?: string }) {
  const router = useRouter();
  const isEditing = Boolean(fallbackId);
  const form = useForm<KbFallbackFormValues>({ defaultValues });
  const query = useQuery({
    queryKey: ["kb-fallback", fallbackId],
    queryFn: () => fetchKbFallbackRule(fallbackId!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (!query.data?.data) {
      return;
    }
    const item = query.data.data;
    form.reset({
      name: item.name,
      category: item.category,
      status: item.status,
      active: item.active,
      responseText: item.responseText,
      ttsText: item.ttsText,
      nextAction: item.nextAction,
      targetMode: item.targetMode,
      targetQueue: item.targetQueue,
      maxWaitSec: item.maxWaitSec,
      onFailAction: item.onFailAction,
    });
  }, [form, query.data?.data]);

  const nextAction = useWatch({ control: form.control, name: "nextAction" });
  const onFailAction = useWatch({ control: form.control, name: "onFailAction" });
  const active = useWatch({ control: form.control, name: "active" });
  const mutation = useMutation({
    mutationFn: (payload: KbFallbackFormValues) =>
      isEditing && fallbackId ? updateKbFallbackRule(fallbackId, payload) : createKbFallbackRule(payload),
    onSuccess: (result) => {
      toast.success(isEditing ? "Đã lưu KB fallback" : "Đã tạo KB fallback");
      router.push(`/kb/fallback/${result.data.id}`);
    },
    onError: () => toast.error(isEditing ? "Không thể cập nhật KB fallback" : "Không thể tạo KB fallback"),
  });

  const previewId = useMemo(() => fallbackId ?? "FBK-NEW", [fallbackId]);

  if (query.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (query.isError) {
    return <AsyncState state="error" onRetry={() => query.refetch()} />;
  }

  if (isEditing && !query.data?.data) {
    return <AsyncState state="empty" message="Không tìm thấy KB fallback để chỉnh sửa." />;
  }

  return (
    <KbShell
      title="KB Fallback"
      description="Cấu hình nội dung fallback nghiệp vụ khi bot không tìm được intent phù hợp hoặc KB match quá thấp."
      actions={
        <Link href={isEditing && fallbackId ? `/kb/fallback/${fallbackId}` : "/kb/fallback"}>
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> {isEditing ? "Về chi tiết" : "Về danh sách"}
          </Button>
        </Link>
      }
    >
      <Card className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-3xl font-bold">{isEditing ? "Edit Fallback Response" : "Create Fallback Response"}</h3>
            <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-sm font-medium text-[var(--text-dim)]">
              ID: {previewId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
              {active ? "ACTIVE" : "OFF"}
            </span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            <div>
              <label className="mb-1 block text-sm font-semibold">Tên fallback</label>
              <Input {...form.register("name")} className="h-12 rounded-xl text-lg" />
            </div>
            <div className="rounded-[22px] border border-[#d7deea] bg-[#f8fafc] p-5">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] text-[var(--text-dim)]">ACTIVE</p>
                <label className="mt-4 flex items-center justify-between gap-4 text-xl font-medium">
                  <span>{active ? "On" : "Off"}</span>
                  <span className="relative inline-flex">
                    <input type="checkbox" {...form.register("active")} className="peer sr-only" />
                    <span className="h-9 w-16 rounded-full bg-[#d6dbe4] transition peer-checked:bg-[var(--accent)]" />
                    <span className="pointer-events-none absolute left-1 top-1 h-7 w-7 rounded-full bg-white shadow transition peer-checked:translate-x-7" />
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Category</label>
            <Select {...form.register("category")} className="h-12 rounded-xl text-lg">
              {kbFallbackCategoryOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Fallback response</label>
              <Textarea rows={4} {...form.register("responseText")} className="min-h-32 rounded-xl px-4 py-3 text-base" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Bản đọc thoại (TTS)</label>
              <Textarea rows={4} {...form.register("ttsText")} className="min-h-32 rounded-xl px-4 py-3 text-base" />
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Next action</p>
            <div className="grid gap-3 xl:grid-cols-4">
              {kbFallbackNextActions.map((action) => {
                const active = nextAction === action.value;
                return (
                  <label
                    key={action.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-5 text-base font-medium ${
                      active ? "border-[var(--accent)] bg-sky-50" : "border-[var(--line)] bg-white"
                    }`}
                  >
                    <input type="radio" value={action.value} {...form.register("nextAction")} className="h-5 w-5 accent-[var(--accent)]" />
                    {action.label}
                  </label>
                );
              })}
            </div>
          </div>

          {nextAction === "TRANSFER_AGENT" ? (
            <div className="rounded-2xl border-2 border-[var(--accent)] bg-[#f7fbff] p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 rounded-full border-4 border-[var(--accent)] border-offset-2" />
                <h4 className="text-2xl font-bold">Chuyển agent</h4>
                <span className="text-sm font-semibold text-[var(--text-dim)]">CONFIG OVERRIDES</span>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-4">
                <div>
                  <p className="mb-2 text-xs font-semibold text-[var(--text-dim)]">TARGET MODE</p>
                  <div className="space-y-2 text-base">
                    <label className="flex items-center gap-2">
                      <input type="radio" value="PRESET" {...form.register("targetMode")} className="h-5 w-5 accent-[var(--accent)]" /> Config sẵn
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" value="OVERRIDE" {...form.register("targetMode")} className="h-5 w-5 accent-[var(--accent)]" /> Override
                    </label>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-dim)]">TARGET QUEUE</label>
                  <Select {...form.register("targetQueue")} className="h-12 rounded-xl text-base">
                    {kbFallbackQueueOptions.map((queue) => (
                      <option key={queue} value={queue}>
                        {queue}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-dim)]">MAX WAIT (S)</label>
                  <Input type="number" {...form.register("maxWaitSec", { valueAsNumber: true })} className="h-12 rounded-xl text-base" />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[30, 60, 120, 300].map((time) => (
                      <button
                        key={time}
                        type="button"
                        className="rounded-lg border border-[var(--line)] bg-white px-2 py-1 text-xs font-medium"
                        onClick={() => form.setValue("maxWaitSec", time)}
                      >
                        {time}s
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-dim)]">ON FAIL ACTION</label>
                  <Select className="h-12 rounded-xl border-[#ff7875] text-base text-[#9f1239]" {...form.register("onFailAction")}>
                    {kbFallbackFailActions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {onFailAction === "PLAY_ERROR_MESSAGE" ? (
                <div className="mt-4 rounded-xl border border-[#fecaca] bg-[#fff1f0] px-4 py-3 text-sm font-medium text-[#cf1322]">
                  Error: Hàng chờ bận sẽ phát error message thay vì retry chuyển tiếp liên tục.
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <Link href={isEditing && fallbackId ? `/kb/fallback/${fallbackId}` : "/kb/fallback"}>
              <Button type="button" variant="secondary">
                Hủy
              </Button>
            </Link>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo fallback"}
            </Button>
          </div>
        </form>
      </Card>
    </KbShell>
  );
}
