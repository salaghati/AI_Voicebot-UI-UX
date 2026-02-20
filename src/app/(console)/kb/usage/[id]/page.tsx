"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchKbDocs, fetchKbUsage } from "@/lib/api-client";
import { KbShell } from "@/features/kb";
import { Card } from "@/components/ui/card";
import { AsyncState } from "@/components/shared/async-state";

export default function KbUsageDetailPage() {
  const params = useParams<{ id: string }>();
  const usageQuery = useQuery({ queryKey: ["kb-usage-detail"], queryFn: () => fetchKbUsage() });
  const kbQuery = useQuery({ queryKey: ["kb-list"], queryFn: () => fetchKbDocs() });

  const record = useMemo(
    () => usageQuery.data?.data.find((item) => item.id === params.id),
    [usageQuery.data?.data, params.id],
  );
  const kbTitle = useMemo(
    () => kbQuery.data?.data.find((item) => item.id === record?.kbId)?.title ?? record?.kbId,
    [kbQuery.data?.data, record?.kbId],
  );
  const isLoading = usageQuery.isLoading || kbQuery.isLoading;
  const isError = usageQuery.isError || kbQuery.isError;

  return (
    <KbShell
      title="KB - 3.1 Chi tiết sử dụng"
      description="Lịch sử hội thoại, thông tin phiên và tài liệu match cao nhất"
    >
      {isLoading ? <AsyncState state="loading" /> : null}
      {isError ? (
        <AsyncState
          state="error"
          onRetry={() => {
            usageQuery.refetch();
            kbQuery.refetch();
          }}
        />
      ) : null}
      {!isLoading && !isError && !record ? <AsyncState state="empty" /> : null}
      {record ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-2">
            <h3 className="text-lg font-semibold">Thông tin phiên</h3>
            <p className="text-sm">KB: {kbTitle}</p>
            <p className="text-sm text-[var(--text-dim)]">KB ID: {record.kbId}</p>
            <p className="text-sm">Workflow: {record.workflow}</p>
            <p className="text-sm">Số cuộc gọi dùng KB: {record.calls}</p>
            <p className="text-sm">Top intent: {record.topIntent}</p>
          </Card>

          <Card className="space-y-2">
            <h3 className="text-lg font-semibold">Lịch sử hội thoại mẫu</h3>
            <div className="rounded-lg border border-[var(--line)] bg-white p-3 text-sm">
              KH: Tôi cần biết phí trả chậm là bao nhiêu?
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-white p-3 text-sm">
              Bot: Theo tài liệu {kbTitle}, phí trả chậm là 2% trên dư nợ.
            </div>
          </Card>
        </div>
      ) : null}
    </KbShell>
  );
}
