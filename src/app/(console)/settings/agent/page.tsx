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
import type { AgentGroup, HandoverProfile } from "@/types/domain";

function mapPriorityTone(priority: AgentGroup["priority"]) {
  if (priority === "Cao") return "success";
  if (priority === "Trung bình") return "warning";
  return "danger";
}

export default function SettingsAgentPage() {
  const [openQueueModal, setOpenQueueModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [editedGroups, setEditedGroups] = useState<AgentGroup[] | null>(null);
  const [editedProfiles, setEditedProfiles] = useState<HandoverProfile[] | null>(null);
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
  const profileForm = useForm({
    defaultValues: {
      profileName: "Outbound Default",
      description: "",
      targetRefId: "grp_support_l1",
      contextTemplateId: "ctx_standard",
      failAction: "retry_transfer",
      active: "true",
    },
  });

  const query = useQuery({ queryKey: ["settings-agent"], queryFn: fetchAgentSettings });
  useEffect(() => {
    if (query.data?.data) {
      form.reset({
        transferIntents: query.data.data.globalPolicy?.escapeIntents?.join(", ") || query.data.data.transferCondition,
        transferRepeatCount: String(query.data.data.globalPolicy?.repeatThreshold ?? 3),
        transferKeywords: query.data.data.globalPolicy?.escapeKeywords?.join(", ") || query.data.data.transferContext.join(", "),
        contextIntent: true,
        contextEntity: true,
        contextHistory: true,
        contextTranscript: false,
      });
    }
  }, [query.data?.data, form]);
  const currentGroups = editedGroups ?? query.data?.data.groups ?? [];
  const currentProfiles = editedProfiles ?? query.data?.data.handoverProfiles ?? [];

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
          onSubmit={form.handleSubmit((values) =>
            mutation.mutate({
              transferCondition: values.transferIntents,
              transferContext: values.transferKeywords
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              queue: currentGroups[0]?.name || "",
              groups: currentGroups,
              handoverProfiles: currentProfiles,
              globalPolicy: {
                escapeIntents: values.transferIntents
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
                escapeKeywords: values.transferKeywords
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
                repeatThreshold: Number(values.transferRepeatCount) || 3,
              },
            }),
          )}
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="space-y-3">
              <h3 className="text-2xl font-bold">Nhóm Agent nhận chuyển</h3>
              <p className="text-sm text-[var(--text-dim)]">
                Đây là source-of-truth cho các nhóm người thật nhận handover từ outbound và inbound.
              </p>
              <div className="space-y-2">
                {currentGroups.map((item) => (
                  <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr] gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-[var(--text-dim)]">{item.description || "Không có mô tả"}</p>
                    </div>
                    <p>{item.agents}</p>
                    <div>
                      <Badge tone={mapPriorityTone(item.priority)}>{item.priority}</Badge>
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
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold">Handover Profiles</h3>
                <p className="text-sm text-[var(--text-dim)]">
                  Outbound Campaign, Inbound Route và Workflow Handover node sẽ tham chiếu tới các profile này.
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={() => setOpenProfileModal(true)}>
                Thêm profile
              </Button>
            </div>

            <div className="grid gap-3 xl:grid-cols-3">
              {currentProfiles.map((profile) => {
                const group = currentGroups.find((item) => item.id === profile.targetRefId);
                return (
                  <div key={profile.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{profile.name}</p>
                      <Badge tone={profile.active ? "success" : "muted"}>
                        {profile.active ? "Active" : "Off"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-dim)]">{profile.description || "Không có mô tả"}</p>
                    <div className="mt-3 space-y-1 text-sm">
                      <p>Target: <span className="font-medium">{group?.name || profile.targetRefId}</span></p>
                      <p>Context template: <span className="font-medium">{profile.contextTemplateId}</span></p>
                      <p>Fail action: <span className="font-medium">{profile.failAction}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

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
                const nextGroup: AgentGroup = {
                  id: `grp_${values.queueName.trim().toLowerCase().replace(/\s+/g, "_")}`,
                  name: values.queueName,
                  description: values.description,
                  priority: values.priority as AgentGroup["priority"],
                  maxWaitSec: Number(values.maxWait) || 60,
                  callbackAllowed: values.callback === "true",
                  active: values.active === "true",
                  agents: 0,
                };
                setEditedGroups((prev) => [...(prev ?? currentGroups), nextGroup]);
                toast.success(`Đã thêm nhóm ${values.queueName} (local)`);
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

      {openProfileModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <Card className="w-full max-w-3xl space-y-4 rounded-2xl bg-white p-0">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
              <h3 className="text-2xl font-bold">Thêm handover profile</h3>
              <button
                type="button"
                className="rounded-md p-1 text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
                onClick={() => setOpenProfileModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="grid gap-4 px-6 pb-6 md:grid-cols-2"
              onSubmit={profileForm.handleSubmit((values) => {
                const nextProfile: HandoverProfile = {
                  id: `hp_${values.profileName.trim().toLowerCase().replace(/\s+/g, "_")}`,
                  name: values.profileName,
                  targetType: "agent_group",
                  targetRefId: values.targetRefId,
                  contextTemplateId: values.contextTemplateId,
                  failAction: values.failAction as HandoverProfile["failAction"],
                  active: values.active === "true",
                  description: values.description,
                };
                setEditedProfiles((prev) => [...(prev ?? currentProfiles), nextProfile]);
                toast.success(`Đã thêm handover profile ${values.profileName} (local)`);
                setOpenProfileModal(false);
              })}
            >
              <div>
                <label className="mb-1 block text-sm font-medium">Tên profile</label>
                <Input {...profileForm.register("profileName")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Nhóm nhận chuyển</label>
                <Select {...profileForm.register("targetRefId")}>
                  {currentGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Mô tả</label>
                <Textarea {...profileForm.register("description")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Context template</label>
                <Select {...profileForm.register("contextTemplateId")}>
                  <option value="ctx_standard">ctx_standard</option>
                  <option value="ctx_full_transcript">ctx_full_transcript</option>
                  <option value="ctx_vip">ctx_vip</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Fail action</label>
                <Select {...profileForm.register("failAction")}>
                  <option value="retry_transfer">retry_transfer</option>
                  <option value="fallback_node">fallback_node</option>
                  <option value="end_call">end_call</option>
                  <option value="callback">callback</option>
                </Select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 border-t border-[var(--line)] pt-4">
                <Button type="button" variant="secondary" onClick={() => setOpenProfileModal(false)}>
                  Hủy
                </Button>
                <Button type="submit">Thêm profile</Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </SettingsShell>
  );
}
