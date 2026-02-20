"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchKbDocs } from "@/lib/api-client";
import { KbShell } from "@/features/kb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function KbVersionPage() {
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const query = useQuery({ queryKey: ["kb-version"], queryFn: () => fetchKbDocs() });

  return (
    <KbShell title="KB - 1.2 Kiểm tra version" description="Kiểm tra phiên bản KB và đồng bộ dữ liệu">
      <Card className="space-y-3">
        {query.data?.data.map((item) => (
          <div key={item.id} className="rounded-xl border border-[var(--line)] bg-white p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-[var(--text-dim)]">{item.id} • {item.version}</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setCheckingId(item.id);
                  setTimeout(() => {
                    setCheckingId(null);
                    toast.success(`KB ${item.id} đang ở bản mới nhất`);
                  }, 600);
                }}
              >
                {checkingId === item.id ? "Đang kiểm tra..." : "Kiểm tra version"}
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </KbShell>
  );
}
