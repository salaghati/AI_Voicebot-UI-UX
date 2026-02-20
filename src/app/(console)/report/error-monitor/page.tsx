"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchErrorMetrics } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { AsyncState } from "@/components/shared/async-state";

export default function ErrorMonitorPage() {
  const query = useQuery({ queryKey: ["error-monitor"], queryFn: () => fetchErrorMetrics() });

  if (query.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (query.isError) {
    return <AsyncState state="error" onRetry={() => query.refetch()} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Report - Giám sát lỗi" description="Biểu đồ lỗi theo thời gian và bảng chi tiết" />
      <Card className="space-y-3">
        <h3 className="font-semibold">Biểu đồ mô phỏng</h3>
        {query.data?.data.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{item.type}</span>
              <span className="text-[var(--text-dim)]">{item.count} lỗi</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-2)]">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0284c7)]" style={{ width: `${Math.min(item.count, 100)}%` }} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
