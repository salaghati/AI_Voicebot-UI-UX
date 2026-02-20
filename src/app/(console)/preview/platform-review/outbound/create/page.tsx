"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { knowledgeRefs, workflowRefs } from "@/features/platform-review/mock";

const steps = [
  "Thông tin Campaign",
  "Data Source",
  "Workflow",
  "Knowledge Base",
  "Lịch gọi & Retry",
  "Review",
] as const;

export default function OutboundCreateReviewPage() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    name: "",
    description: "",
    sourceType: "CRM",
    workflowId: "",
    kbId: "",
    schedule: "09:00 - 19:00",
    retryRule: "Retry 2 lần, mỗi 15 phút",
  });

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
        description="Create flow kiểu chatbot."
        actions={
          <Link href="/preview/platform-review/outbound">
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
          <div>
            <label className="mb-1 block text-sm font-medium">Workflow</label>
            <Select value={draft.workflowId} onChange={(e) => setDraft((p) => ({ ...p, workflowId: e.target.value }))}>
              <option value="">Chọn workflow</option>
              {workflowRefs.filter((w) => w.kind === "Outbound").map((item) => (
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

        {step === 5 ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm">
              <p><strong>Campaign:</strong> {draft.name || "--"}</p>
              <p><strong>Source:</strong> {draft.sourceType}</p>
              <p><strong>Workflow:</strong> {draft.workflowId || "Chưa chọn"}</p>
              <p><strong>KB:</strong> {draft.kbId || "Chưa chọn"}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm">
              <p className="text-[var(--text-dim)]">Campaign chỉ lưu workflowId và kbId, không nhúng dữ liệu workflow/KB.</p>
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
                toast.success("Tạo campaign thành công (mock). ");
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
