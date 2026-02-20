"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchCallReport } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AsyncState } from "@/components/shared/async-state";
import { mapStatusTone } from "@/lib/mappers";
import { formatDateTime } from "@/lib/utils";

export default function CallDetailPage() {
  const params = useParams<{ id: string }>();
  const callId = params.id;

  const query = useQuery({
    queryKey: ["call-detail", callId],
    queryFn: () => fetchCallReport(callId),
    enabled: Boolean(callId),
  });

  if (query.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (query.isError || !query.data?.data) {
    return <AsyncState state="error" onRetry={() => query.refetch()} />;
  }

  const call = query.data.data;

  return (
    <div className="space-y-4">
      <PageHeader title="Report - Chi tiết cuộc gọi" description="Transcript, ghi âm, intent và entity nhận diện" />
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-2 lg:col-span-2">
          <h3 className="text-lg font-semibold">Transcript hội thoại</h3>
          <div className="space-y-2">
            {call.transcript.map((line, index) => (
              <div key={`${line.time}-${index}`} className="rounded-xl border border-[var(--line)] bg-white p-3">
                <p className="text-xs text-[var(--text-dim)]">{line.time} • {line.speaker}</p>
                <p className="text-sm">{line.content}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-3">
          <h3 className="text-lg font-semibold">Thông tin cuộc gọi</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[var(--text-dim)]">Call ID</span><span>{call.id}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-dim)]">SĐT KH</span><span>{call.customerPhone}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-dim)]">Workflow</span><span>{call.workflow}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-dim)]">Intent</span><span>{call.intent}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-dim)]">Bắt đầu</span><span>{formatDateTime(call.startAt)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-dim)]">Trạng thái</span><Badge tone={mapStatusTone(call.status)}>{call.status}</Badge></div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Entity nhận diện</p>
            <div className="space-y-1">
              {call.entities.map((entity) => (
                <div key={entity.key} className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-2 py-1 text-sm">
                  {entity.key}: <span className="font-medium">{entity.value}</span>
                </div>
              ))}
            </div>
          </div>

          <audio controls className="w-full">
            <source src="" />
          </audio>
        </Card>
      </section>
    </div>
  );
}
