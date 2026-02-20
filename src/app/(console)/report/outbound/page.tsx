"use client";

import { EntityListPage } from "@/features/bot-engine";
import { fetchOutboundReports } from "@/lib/api-client";
import { formatDateTime } from "@/lib/utils";

export default function OutboundReportPage() {
  return (
    <EntityListPage
      title="Report - Outbound"
      description="Bảng thống kê cuộc gọi theo chiến dịch và lịch gọi lại"
      queryKey="report-outbound"
      showCreate={false}
      showRowActions={false}
      statuses={["Success", "Failed", "Transferred"]}
      fetcher={fetchOutboundReports}
      detailHref={(item) => `/report/call-detail/${item.id}`}
      columns={[
        { key: "id", label: "Mã cuộc gọi", render: (item) => item.id },
        { key: "campaign", label: "Chiến dịch", render: (item) => item.campaign },
        { key: "customerPhone", label: "SĐT KH", render: (item) => item.customerPhone },
        { key: "workflow", label: "Workflow", render: (item) => item.workflow },
        { key: "durationSec", label: "Thời lượng", render: (item) => `${item.durationSec}s` },
        { key: "startAt", label: "Bắt đầu", render: (item) => formatDateTime(item.startAt) },
      ]}
    />
  );
}
