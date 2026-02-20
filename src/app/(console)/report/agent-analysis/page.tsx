"use client";

import { EntityListPage } from "@/features/bot-engine";
import { fetchAgentMetrics } from "@/lib/api-client";

export default function AgentAnalysisPage() {
  return (
    <EntityListPage
      title="Report - Phân tích Agent"
      description="Bảng thống kê hiệu suất agent và export Excel"
      queryKey="agent-analysis"
      showCreate={false}
      showRowActions={false}
      fetcher={fetchAgentMetrics}
      columns={[
        { key: "agentName", label: "Agent", render: (item) => item.agentName },
        { key: "handledCalls", label: "Số cuộc gọi", render: (item) => item.handledCalls },
        { key: "avgHandleTime", label: "AHT", render: (item) => `${item.avgHandleTime}s` },
        { key: "transferRate", label: "Transfer", render: (item) => `${item.transferRate}%` },
        { key: "csat", label: "CSAT", render: (item) => item.csat },
      ]}
    />
  );
}
