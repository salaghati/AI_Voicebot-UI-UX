"use client";

import { EntityListPage } from "@/features/bot-engine";
import { fetchInboundReports } from "@/lib/api-client";
import { formatDateTime } from "@/lib/utils";

export default function InboundReportPage() {
  return (
    <EntityListPage
      title="Report - Inbound"
      description="Bảng cuộc gọi inbound theo workflow và intent"
      queryKey="report-inbound"
      showCreate={false}
      showRowActions={false}
      statuses={["Success", "Failed", "Transferred"]}
      fetcher={fetchInboundReports}
      detailHref={(item) => `/report/call-detail/${item.id}`}
      columns={[
        { key: "id", label: "Mã cuộc gọi", render: (item) => item.id },
        { key: "customerPhone", label: "SĐT KH", render: (item) => item.customerPhone },
        { key: "workflow", label: "Workflow", render: (item) => item.workflow },
        { key: "intent", label: "Intent", render: (item) => item.intent },
        { key: "durationSec", label: "Thời lượng", render: (item) => `${item.durationSec}s` },
        { key: "startAt", label: "Bắt đầu", render: (item) => formatDateTime(item.startAt) },
      ]}
    />
  );
}
