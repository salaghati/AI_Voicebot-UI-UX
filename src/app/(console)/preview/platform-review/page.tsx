"use client";

import Link from "next/link";
import { GitBranch, Database, Bot } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PlatformReviewHomePage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Platform UX Review"
        description="Bản preview UX theo pattern quản lý Chatbot: Bot Engine chỉ reference Workflow và Knowledge Base."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Bot className="h-5 w-5 text-[var(--accent)]" /> Outbound Campaigns
          </div>
          <p className="text-sm text-[var(--text-dim)]">
            List kiểu row-card, có search/filter/sort, status badge và kebab actions.
          </p>
          <Link href="/preview/platform-review/outbound">
            <Button>Xem preview Outbound</Button>
          </Link>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Bot className="h-5 w-5 text-[var(--accent)]" /> Inbound Routes
          </div>
          <p className="text-sm text-[var(--text-dim)]">
            Danh sách route inbound với reference rõ Workflow + Knowledge Base + Queue/Extension.
          </p>
          <Link href="/preview/platform-review/inbound">
            <Button>Xem preview Inbound</Button>
          </Link>
        </Card>
      </section>

      <Card className="space-y-3">
        <h3 className="text-lg font-semibold">Quan hệ dữ liệu (reference-only)</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <p className="flex items-center gap-2 font-semibold"><Bot className="h-4 w-4" /> Campaign / Route</p>
            <p className="mt-1 text-sm text-[var(--text-dim)]">Giữ workflowId, kbId và metadata vận hành.</p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <p className="flex items-center gap-2 font-semibold"><GitBranch className="h-4 w-4" /> Workflow module</p>
            <p className="mt-1 text-sm text-[var(--text-dim)]">Node graph, preview/test, version management.</p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <p className="flex items-center gap-2 font-semibold"><Database className="h-4 w-4" /> Knowledge Base module</p>
            <p className="mt-1 text-sm text-[var(--text-dim)]">KB list/create/detail/version/usage độc lập.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
