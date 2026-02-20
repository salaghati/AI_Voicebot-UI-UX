"use client";

import Link from "next/link";
import { useState } from "react";
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
import { knowledgeRefs, workflowRefs } from "@/features/bot-engine/mock";

const steps = ["Thông tin Route", "Queue/Extension", "Workflow", "Knowledge Base", "KB Fallback", "Review"] as const;

export default function InboundCreatePage() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    name: "",
    description: "",
    queue: "Queue Payment",
    extension: "801",
    workflowId: "",
    kbId: "",
    fallbackRuleId: "",
  });
  const fallbackQuery = useQuery({ queryKey: ["kb-fallback-active"], queryFn: fetchActiveKbFallbackRules });

  const validate = () => {
    if (step === 0 && !draft.name.trim()) {
      toast.error("Nhập tên route trước.");
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
        title="Tạo Inbound Route"
        description="Tạo tuyến inbound mới."
        actions={
          <Link href="/bot-engine/inbound">
            <Button variant="secondary" className="gap-2"><ArrowLeft className="h-4 w-4" /> Danh sách</Button>
          </Link>
        }
      />

      <Card className="grid gap-2 md:grid-cols-6">
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
              <label className="mb-1 block text-sm font-medium">Route name</label>
              <Input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <Textarea rows={2} value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Queue</label>
              <Select value={draft.queue} onChange={(e) => setDraft((p) => ({ ...p, queue: e.target.value }))}>
                <option>Queue Payment</option>
                <option>Queue Sales</option>
                <option>Queue Support</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Extension</label>
              <Input value={draft.extension} onChange={(e) => setDraft((p) => ({ ...p, extension: e.target.value }))} />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <label className="mb-1 block text-sm font-medium">Workflow</label>
            <Select value={draft.workflowId} onChange={(e) => setDraft((p) => ({ ...p, workflowId: e.target.value }))}>
              <option value="">Chọn workflow</option>
              {workflowRefs.map((item) => (
                <option key={item.id} value={item.id}>{item.name} ({item.id})</option>
              ))}
            </Select>
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
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm">
            <p><strong>Route:</strong> {draft.name || "--"}</p>
            <p><strong>Queue/Extension:</strong> {draft.queue} / {draft.extension}</p>
            <p><strong>Workflow:</strong> {draft.workflowId || "Chưa chọn"}</p>
            <p><strong>KB:</strong> {draft.kbId || "Chưa chọn"}</p>
            <p><strong>KB Fallback:</strong> {draft.fallbackRuleId || "Không chọn"}</p>
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
                toast.success("Tạo inbound route thành công (mock).");
              }}
            >
              Tạo Route
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
