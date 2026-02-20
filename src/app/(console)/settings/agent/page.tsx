"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";
import { fetchAgentSettings, updateAgentSettings } from "@/lib/api-client";
import { SettingsShell } from "@/features/settings";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AsyncState } from "@/components/shared/async-state";
import { Badge } from "@/components/ui/badge";

const groups = [
  { name: "Support_L1", agents: 15, priority: "Cao" },
  { name: "Support_L2", agents: 8, priority: "Trung bình" },
  { name: "VIP_Support", agents: 5, priority: "Đặc biệt" },
];

export default function SettingsAgentPage() {
  const [openQueueModal, setOpenQueueModal] = useState(false);
  const form = useForm({
    defaultValues: {
      transferIntents: "khieu_nai, yeu_cau_gap_nguoi, khong_hieu",
      transferRepeatCount: "3",
      transferKeywords: "gặp người, nhân viên, tư vấn viên",
      contextIntent: true,
      contextEntity: true,
      contextHistory: true,
      contextTranscript: false,
    },
  });

  const queueForm = useForm({
    defaultValues: {
      queueName: "Support_L1",
      description: "",
      priority: "Cao",
      maxWait: "60",
      callback: "false",
      active: "true",
    },
  });

  const query = useQuery({ queryKey: ["settings-agent"], queryFn: fetchAgentSettings });
  useEffect(() => {
    if (query.data?.data) {
      form.reset({
        transferIntents: query.data.data.transferCondition,
        transferRepeatCount: "3",
        transferKeywords: query.data.data.transferContext.join(", "),
        contextIntent: true,
        contextEntity: true,
        contextHistory: true,
        contextTranscript: false,
      });
    }
  }, [query.data?.data, form]);

  const mutation = useMutation({
    mutationFn: updateAgentSettings,
    onSuccess: () => toast.success("Lưu cấu hình Agent thành công"),
    onError: () => toast.error("Không thể lưu cấu hình Agent"),
  });

  return (
    <SettingsShell
      title="Agent Handover"
      description="Thiết lập điều kiện chuyển Agent và context package"
      section="Agent Handover"
    >
      {query.isLoading ? <AsyncState state="loading" /> : null}
      {query.isError ? <AsyncState state="error" onRetry={() => query.refetch()} /> : null}

      {!query.isLoading && !query.isError ? (
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="space-y-3">
              <h3 className="text-2xl font-bold">Nhóm Agent nhận chuyển</h3>
              <div className="space-y-2">
                {groups.map((item) => (
                  <div key={item.name} className="grid grid-cols-[2fr_1fr_1fr] gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p>{item.agents}</p>
                    <div>
                      {item.priority === "Cao" ? <Badge tone="success">Cao</Badge> : null}
                      {item.priority === "Trung bình" ? <Badge tone="warning">Trung bình</Badge> : null}
                      {item.priority === "Đặc biệt" ? <Badge tone="danger">Đặc biệt</Badge> : null}
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" className="w-full" onClick={() => setOpenQueueModal(true)}>
                Thêm nhóm
              </Button>
            </Card>

            <Card className="space-y-3">
              <h3 className="text-2xl font-bold">Điều kiện chuyển Agent</h3>
              <div>
                <label className="mb-1 block text-sm font-medium">Chuyển khi Intent là</label>
                <Input {...form.register("transferIntents")} />
                <p className="mt-1 text-xs text-[var(--accent)]">+ Thêm</p>
              </div>
              <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                <Input type="number" {...form.register("transferRepeatCount")} />
                <span className="text-sm">lần (khi hỏi lặp lại)</span>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Chuyển khi có từ khóa</label>
                <Textarea {...form.register("transferKeywords")} />
              </div>
            </Card>
          </div>

          <Card className="space-y-3">
            <h3 className="text-2xl font-bold">Context Package (Gửi cho Agent)</h3>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("contextIntent")} />
                Intent đã nhận diện
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("contextEntity")} />
                Entity đã thu thập
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("contextHistory")} />
                Lịch sử 5 câu thoại gần nhất
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("contextTranscript")} />
                Toàn bộ transcript
              </label>
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => form.reset()}>
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang lưu..." : "Lưu cấu hình"}
            </Button>
          </div>
        </form>
      ) : null}

      {openQueueModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <Card className="w-full max-w-4xl space-y-4 rounded-2xl bg-white p-0">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
              <h3 className="text-2xl font-bold">Thêm nhóm nhận chuyển</h3>
              <button
                type="button"
                className="rounded-md p-1 text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
                onClick={() => setOpenQueueModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="grid gap-4 px-6 pb-6 md:grid-cols-2"
              onSubmit={queueForm.handleSubmit((values) => {
                toast.success(`Đã lưu nhóm ${values.queueName} (mock)`);
                setOpenQueueModal(false);
              })}
            >
              <div className="space-y-3">
                <p className="text-lg font-semibold">Thông tin hàng chờ</p>
                <div>
                  <label className="mb-1 block text-sm font-medium">Tên nhóm *</label>
                  <Input {...queueForm.register("queueName")} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Mô tả</label>
                  <Textarea {...queueForm.register("description")} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Mức ưu tiên</label>
                  <Select {...queueForm.register("priority")}>
                    <option>Cao</option>
                    <option>Trung bình</option>
                    <option>Đặc biệt</option>
                  </Select>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked {...queueForm.register("active")} />
                  Trạng thái hoạt động
                </label>
              </div>

              <div className="space-y-3 border-l border-[var(--line)] pl-4">
                <p className="text-lg font-semibold">Thiết lập xếp hàng</p>
                <div>
                  <label className="mb-1 block text-sm font-medium">Giới hạn chờ (Max wait)</label>
                  <Input type="number" {...queueForm.register("maxWait")} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...queueForm.register("callback")} />
                  Cho phép callback
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 border-t border-[var(--line)] pt-4">
                <Button type="button" variant="secondary" onClick={() => setOpenQueueModal(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu nhóm</Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </SettingsShell>
  );
}
