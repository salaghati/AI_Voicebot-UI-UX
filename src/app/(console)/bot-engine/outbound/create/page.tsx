"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchActiveKbFallbackRules } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { knowledgeRefs, workflowRefs, type WorkflowRef } from "@/features/bot-engine/mock";

const steps = [
  "Thông tin Campaign",
  "Data Source",
  "Workflow",
  "Knowledge Base",
  "KB Fallback",
  "Lịch gọi & Retry",
  "Review",
] as const;

type WorkflowSetupMode = "existing" | "new";
type LocalWorkflowOption = WorkflowRef & {
  source: "library" | "inline";
};

const OUTBOUND_DRAFT_STORAGE_KEY = "bot-engine-outbound-create-draft";

const outboundWorkflowLibrary: LocalWorkflowOption[] = workflowRefs
  .filter((item) => item.kind === "Outbound")
  .map((item) => ({ ...item, source: "library" as const }));

const workflowModeMeta: Record<WorkflowSetupMode, { title: string; description: string }> = {
  existing: {
    title: "Dùng workflow có sẵn",
    description: "Phù hợp khi campaign này chỉ cần gắn vào logic đã được review trước.",
  },
  new: {
    title: "Tạo workflow mới ngay ở đây",
    description: "Phù hợp khi người vận hành bắt đầu từ campaign rồi mới tạo logic bot.",
  },
};

export default function OutboundCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [workflowMode, setWorkflowMode] = useState<WorkflowSetupMode>("existing");
  const [workflowOptions, setWorkflowOptions] = useState<LocalWorkflowOption[]>(outboundWorkflowLibrary);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowSummary, setNewWorkflowSummary] = useState("");
  const [draft, setDraft] = useState({
    name: "",
    description: "",
    sourceType: "CRM",
    workflowId: "",
    kbId: "",
    fallbackRuleId: "",
    schedule: "09:00 - 19:00",
    retryRule: "Retry 2 lần, mỗi 15 phút",
  });
  const fallbackQuery = useQuery({ queryKey: ["kb-fallback-active"], queryFn: fetchActiveKbFallbackRules });
  const selectedWorkflow = workflowOptions.find((item) => item.id === draft.workflowId) ?? null;
  const returnWorkflow = useMemo(
    () => ({
      workflowId: searchParams.get("workflowId"),
      workflowName: searchParams.get("workflowName"),
      workflowVersion: searchParams.get("workflowVersion"),
    }),
    [searchParams],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rawDraft = window.sessionStorage.getItem(OUTBOUND_DRAFT_STORAGE_KEY);
    if (!rawDraft) return;
    try {
      const parsed = JSON.parse(rawDraft) as typeof draft;
      setDraft((prev) => ({ ...prev, ...parsed }));
    } catch {
      window.sessionStorage.removeItem(OUTBOUND_DRAFT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(OUTBOUND_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    const { workflowId, workflowName, workflowVersion } = returnWorkflow;
    if (!workflowId || !workflowName) return;

    const workflow: LocalWorkflowOption = {
      id: workflowId,
      name: workflowName,
      kind: "Outbound",
      version: workflowVersion || "v1.0",
      summary: "Workflow mới được tạo từ luồng tạo outbound campaign.",
      source: "inline",
    };

    setWorkflowOptions((prev) => {
      const rest = prev.filter((item) => item.id !== workflow.id);
      return [workflow, ...rest];
    });
    setDraft((prev) => ({ ...prev, workflowId }));
    setStep(2);
    setWorkflowMode("existing");
  }, [returnWorkflow]);

  const handleCreateWorkflowRoute = () => {
    if (!newWorkflowName.trim()) {
      toast.error("Nhập tên workflow mới trước.");
      return;
    }
    const params = new URLSearchParams({
      prefillName: newWorkflowName.trim(),
      prefillDescription: newWorkflowSummary.trim(),
      prefillKind: "Outbound",
      returnTo: "/bot-engine/outbound/create",
      sourceContext: "outbound-create",
    });
    router.push(`/workflow/new?${params.toString()}`);
  };

  const validate = () => {
    if (step === 0 && !draft.name.trim()) {
      toast.error("Nhập tên campaign trước.");
      return false;
    }
    if (step === 2 && !draft.workflowId) {
      toast.error("Bắt buộc chọn Workflow.");
      return false;
    }
    if (step === 3 && !draft.kbId) {
      toast.error("Bắt buộc chọn Knowledge Base.");
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Tạo Outbound Campaign"
        description="Tạo chiến dịch gọi ra mới."
        actions={
          <Link href="/bot-engine/outbound">
            <Button variant="secondary" className="gap-2"><ArrowLeft className="h-4 w-4" /> Danh sách</Button>
          </Link>
        }
      />

      <Card className="grid gap-2 md:grid-cols-7">
        {steps.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => setStep(index)}
            className={`flex items-center gap-2 rounded-lg border px-2 py-2 text-left text-xs ${step === index ? "border-[var(--accent)] bg-[rgba(24,144,255,0.12)]" : "border-[var(--line)] bg-white"}`}
          >
            {index <= step ? <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" /> : <Circle className="h-4 w-4 text-[var(--text-dim)]" />}
            <span>{item}</span>
          </button>
        ))}
      </Card>

      <Card className="space-y-3">
        {step === 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Campaign name</label>
              <Input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <Textarea rows={2} value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {["File", "CRM", "Segment"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDraft((p) => ({ ...p, sourceType: item }))}
                className={`rounded-xl border p-3 text-left ${draft.sourceType === item ? "border-[var(--accent)] bg-[rgba(24,144,255,0.1)]" : "border-[var(--line)]"}`}
              >
                <p className="font-semibold">{item} source</p>
              </button>
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm">
              <p className="font-semibold">Chọn cách gắn logic bot cho campaign này</p>
              <p className="mt-1 text-[var(--text-dim)]">
                Đây là bản thử nghiệm theo hướng business-first: người dùng bắt đầu từ campaign, sau đó mới quyết định dùng workflow sẵn có,
                clone để chỉnh riêng, hoặc tạo workflow mới ngay trong luồng này.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {(Object.entries(workflowModeMeta) as Array<[WorkflowSetupMode, { title: string; description: string }]>).map(([mode, meta]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setWorkflowMode(mode)}
                  className={`rounded-xl border p-4 text-left transition ${
                    workflowMode === mode
                      ? "border-[var(--accent)] bg-[rgba(24,144,255,0.1)] shadow-sm"
                      : "border-[var(--line)] bg-white"
                  }`}
                >
                  <p className="font-semibold">{meta.title}</p>
                  <p className="mt-2 text-sm text-[var(--text-dim)]">{meta.description}</p>
                </button>
              ))}
            </div>

            {workflowMode === "existing" ? (
              <div className="space-y-3 rounded-xl border border-[var(--line)] p-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Workflow có sẵn</label>
                  <Select value={draft.workflowId} onChange={(e) => setDraft((p) => ({ ...p, workflowId: e.target.value }))}>
                    <option value="">Chọn workflow</option>
                    {workflowOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.id})
                      </option>
                    ))}
                  </Select>
                </div>
                <p className="text-xs text-[var(--text-dim)]">
                  Workflow chỉ định bot sẽ xử lý theo logic nào. Nếu workflow có KB node, node đó sẽ dùng KB được bind ở bước tiếp theo.
                </p>
              </div>
            ) : null}

            {workflowMode === "new" ? (
              <div className="space-y-3 rounded-xl border border-[var(--line)] p-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Tên workflow mới</label>
                  <Input
                    value={newWorkflowName}
                    placeholder="Ví dụ: Workflow chăm sóc khách VIP"
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Mô tả ngắn</label>
                  <Textarea
                    rows={3}
                    value={newWorkflowSummary}
                    placeholder="Mô tả ngắn mục tiêu của workflow này"
                    onChange={(e) => setNewWorkflowSummary(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={handleCreateWorkflowRoute}>Tiếp tục sang workflow builder</Button>
                </div>
                <p className="text-xs text-[var(--text-dim)]">
                  Flow hiện tại sẽ chuyển sang `/workflow/new`, điền sẵn tên workflow và bối cảnh tạo từ campaign. Sau khi Publish, hệ thống sẽ quay lại màn này và gắn workflow vừa tạo vào campaign.
                </p>
              </div>
            ) : null}

            {selectedWorkflow ? (
              <div className="rounded-xl border border-[var(--accent)] bg-[rgba(24,144,255,0.08)] p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{selectedWorkflow.name}</p>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[var(--text-dim)]">{selectedWorkflow.id}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[var(--text-dim)]">Version {selectedWorkflow.version}</span>
                </div>
                <p className="mt-2 text-[var(--text-dim)]">{selectedWorkflow.summary}</p>
                <p className="mt-2 text-xs text-[var(--text-dim)]">
                  Nguồn workflow:{" "}
                  {selectedWorkflow.source === "library"
                    ? "thư viện workflow hiện có"
                    : "workflow tạo từ luồng outbound create"}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <label className="mb-1 block text-sm font-medium">Knowledge Base</label>
            <Select value={draft.kbId} onChange={(e) => setDraft((p) => ({ ...p, kbId: e.target.value }))}>
              <option value="">Chọn KB</option>
              {knowledgeRefs.map((item) => (
                <option key={item.id} value={item.id}>{item.title} ({item.id})</option>
              ))}
            </Select>
            <p className="mt-2 text-xs text-[var(--text-dim)]">KB được chọn tại đây là KB context của campaign. Mọi KB node bên trong workflow sẽ sử dụng KB này, không chọn lại KB trong workflow.</p>
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <label className="mb-1 block text-sm font-medium">KB Fallback Rule</label>
            <p className="mb-2 text-xs text-[var(--text-dim)]">Chọn rule fallback khi bot không match intent. Chỉ hiện rule đang Active.</p>
            <Select value={draft.fallbackRuleId} onChange={(e) => setDraft((p) => ({ ...p, fallbackRuleId: e.target.value }))}>
              <option value="">-- Không chọn --</option>
              {(fallbackQuery.data?.data ?? []).map((item) => (
                <option key={item.id} value={item.id}>{item.name} ({item.id})</option>
              ))}
            </Select>
            {fallbackQuery.isLoading ? <p className="mt-1 text-xs text-[var(--text-dim)]">Đang tải...</p> : null}
            {!fallbackQuery.isLoading && (fallbackQuery.data?.data ?? []).length === 0 ? (
              <p className="mt-1 text-xs text-amber-600">Chưa có KB Fallback nào đang Active. Bật tại KB Fallback.</p>
            ) : null}
          </div>
        ) : null}

        {step === 5 ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Lịch gọi</label>
              <Input value={draft.schedule} onChange={(e) => setDraft((p) => ({ ...p, schedule: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Retry rule</label>
              <Input value={draft.retryRule} onChange={(e) => setDraft((p) => ({ ...p, retryRule: e.target.value }))} />
            </div>
          </div>
        ) : null}

        {step === 6 ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm">
              <p><strong>Campaign:</strong> {draft.name || "--"}</p>
              <p><strong>Source:</strong> {draft.sourceType}</p>
              <p><strong>Workflow:</strong> {selectedWorkflow ? `${selectedWorkflow.name} (${selectedWorkflow.id})` : "Chưa chọn"}</p>
              <p><strong>KB:</strong> {draft.kbId || "Chưa chọn"}</p>
              <p><strong>KB Fallback:</strong> {draft.fallbackRuleId || "Không chọn"}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm">
              <p className="text-[var(--text-dim)]">
                Campaign chỉ lưu workflowId, kbId và fallbackRuleId. Workflow quyết định điểm nào tra KB; campaign quyết định dùng KB nào.
                Module Workflow vẫn giữ vai trò thư viện logic, nơi chỉnh sâu, preview và quản lý version.
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between pt-1">
          <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Quay lại</Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => { if (validate()) setStep((s) => s + 1); }}>Tiếp tục</Button>
          ) : (
            <Button
              onClick={() => {
                if (!draft.workflowId || !draft.kbId) {
                  toast.error("Thiếu Workflow hoặc Knowledge Base.");
                  return;
                }
                if (typeof window !== "undefined") {
                  window.sessionStorage.removeItem(OUTBOUND_DRAFT_STORAGE_KEY);
                }
                toast.success("Tạo campaign thành công (mock).");
              }}
            >
              Tạo Campaign
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
