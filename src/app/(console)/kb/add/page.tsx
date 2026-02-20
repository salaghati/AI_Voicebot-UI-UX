"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Files, Globe2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createKbDoc } from "@/lib/api-client";
import { KbShell } from "@/features/kb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KbSourceForm } from "@/features/kb/components/KbSourceForm";
import type { KbSourceType } from "@/types/domain";

const sourceCards: Array<{
  type: KbSourceType;
  title: string;
  description: string;
  icon: typeof Globe2;
}> = [
  {
    type: "url",
    title: "URL Source",
    description: "Crawl một landing page hoặc toàn bộ site để đưa vào KB.",
    icon: Globe2,
  },
  {
    type: "article",
    title: "Article Source",
    description: "Tạo tri thức trực tiếp từ bài viết và nội dung text nội bộ.",
    icon: FileText,
  },
  {
    type: "file",
    title: "File Source",
    description: "Mô phỏng upload PDF, DOCX, TXT để đưa tài liệu vào KB.",
    icon: Files,
  },
];

export default function KbAddPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeType, setActiveType] = useState<KbSourceType | null>(null);

  const mutation = useMutation({
    mutationFn: createKbDoc,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["kb-list"] });
      toast.success("Đã thêm KB mới vào danh sách");
      setActiveType(null);
      router.push("/kb/list");
    },
    onError: () => toast.error("Không thể tạo KB"),
  });

  const activeMeta = useMemo(
    () => sourceCards.find((card) => card.type === activeType) ?? null,
    [activeType],
  );

  return (
    <KbShell
      title="Thêm KB"
      description="Chọn đúng loại nguồn tri thức trước khi tạo KB: URL Source, Article Source hoặc File Source."
      actions={
        <Button variant="secondary" onClick={() => router.push("/kb/list")}>
          Về danh sách KB
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-3">
        {sourceCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.type}
              className="rounded-[28px] border border-[#dbe4f0] p-6 shadow-[0_14px_34px_rgba(15,35,70,0.08)]"
            >
              <div className="flex h-full flex-col">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9f5ff] text-[var(--accent)]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-[#111827]">Add {card.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#667085]">{card.description}</p>
                <Button className="mt-6 w-full" size="lg" onClick={() => setActiveType(card.type)}>
                  Mở form {card.title}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {activeType && activeMeta ? (
        <KbSourceForm
          sourceType={activeType}
          mode="create"
          layout="modal"
          submitting={mutation.isPending}
          onCancel={() => {
            if (mutation.isPending) {
              return;
            }
            setActiveType(null);
          }}
          onSubmit={(payload) => mutation.mutate(payload)}
        />
      ) : null}
    </KbShell>
  );
}
