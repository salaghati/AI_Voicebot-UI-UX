"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { fetchInboundReports, fetchOutboundReports, fetchReportOverview } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/shared/metric-card";
import { AsyncState } from "@/components/shared/async-state";

export default function ReportOverviewPage() {
  const overview = useQuery({ queryKey: ["report-overview"], queryFn: () => fetchReportOverview() });
  const inbound = useQuery({
    queryKey: ["report-overview-inbound"],
    queryFn: () => fetchInboundReports({ page: 1, pageSize: 5 }),
  });
  const outbound = useQuery({
    queryKey: ["report-overview-outbound"],
    queryFn: () => fetchOutboundReports({ page: 1, pageSize: 5 }),
  });

  if (overview.isLoading || inbound.isLoading || outbound.isLoading) {
    return <AsyncState state="loading" />;
  }
  if (overview.isError || inbound.isError || outbound.isError) {
    return <AsyncState state="error" onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Report - Tổng quan"
        description="Bảng tổng hợp tất cả cuộc gọi, filter và export"
        actions={
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" /> Export dữ liệu
          </Button>
        }
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Tổng cuộc gọi" value={String(overview.data?.data.totalCalls ?? 0)} trend="+12.4%" />
        <MetricCard title="Thành công" value={String(overview.data?.data.successCalls ?? 0)} trend="+6.1%" />
        <MetricCard title="Thất bại" value={String(overview.data?.data.failedCalls ?? 0)} trend="-3.8%" up={false} />
        <MetricCard title="Avg Duration" value={`${overview.data?.data.avgDurationSec ?? 0}s`} trend="-1.4%" up={false} />
        <MetricCard title="Conversion" value={`${overview.data?.data.conversionRate ?? 0}%`} trend="+2.6%" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Inbound mới nhất</h3>
            <Link href="/report/inbound" className="text-sm text-[var(--accent)]">
              Xem chi tiết
            </Link>
          </div>
          {inbound.data?.data.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--line)] bg-white p-3">
              <p className="font-medium">{item.id} • {item.workflow}</p>
              <p className="text-sm text-[var(--text-dim)]">{item.customerPhone} • {item.intent}</p>
            </div>
          ))}
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Outbound mới nhất</h3>
            <Link href="/report/outbound" className="text-sm text-[var(--accent)]">
              Xem chi tiết
            </Link>
          </div>
          {outbound.data?.data.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--line)] bg-white p-3">
              <p className="font-medium">{item.id} • {item.campaign}</p>
              <p className="text-sm text-[var(--text-dim)]">{item.customerPhone} • {item.status}</p>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
