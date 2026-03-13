"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye } from "lucide-react";
import { fetchWorkflow } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AsyncState } from "@/components/shared/async-state";
import { formatDateTime } from "@/lib/utils";
import { mapStatusTone } from "@/lib/mappers";

function parseVersion(version: string) {
  const numeric = Number.parseFloat(version.replace("v", ""));
  return Number.isFinite(numeric) ? numeric : 1;
}

function buildVersionHistory(version: string, status: "Active" | "Draft", updatedAt: string) {
  const base = parseVersion(version);
  const baseTime = new Date(updatedAt).getTime();
  const owners = ["admin@voicebot.vn", "ops@voicebot.vn", "qa@voicebot.vn", "system"];
  return Array.from({ length: 6 }).map((_, index) => {
    const nextVersion = Math.max(1, base - index * 0.1);
    const versionText = `v${nextVersion.toFixed(1)}`;
    const timeOffset = baseTime - index * 86400000;
    return {
      id: `${versionText}-${index}`,
      version: versionText,
      status: index === 0 ? status : index % 2 === 0 ? "Draft" : "Active",
      updatedAt: new Date(timeOffset).toISOString(),
      updatedBy: owners[index % owners.length],
      note:
        index === 0
          ? "Bản mới nhất đang dùng trong runtime."
          : index % 2 === 0
            ? "Tinh chỉnh branch điều kiện và nội dung fallback."
            : "Cập nhật prompt thoại và tối ưu API mapping.",
      changes:
        index === 0
          ? "Publish hiện tại"
          : index % 2 === 0
            ? "Sửa condition + cấu hình KB"
            : "Sửa prompt + retry",
    };
  });
}

export default function WorkflowVersionHistoryPage() {
  const params = useParams<{ id: string }>();
  const workflowId = params.id;
  const query = useQuery({
    queryKey: ["workflow-version-history", workflowId],
    queryFn: () => fetchWorkflow(workflowId),
  });

  const workflow = query.data?.data;
  const history = useMemo(
    () => (workflow ? buildVersionHistory(workflow.version, workflow.status, workflow.updatedAt) : []),
    [workflow],
  );

  if (query.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (query.isError || !workflow) {
    return <AsyncState state="error" onRetry={() => query.refetch()} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Workflow Version - ${workflow.name}`}
        description="Lịch sử phiên bản workflow để kiểm tra thay đổi trước khi rollback/publish."
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/workflow/${workflow.id}`}>
              <Button variant="secondary" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Quay lại workflow
              </Button>
            </Link>
          </div>
        }
      />

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-[var(--surface-2)] text-left text-xs uppercase tracking-wide text-[var(--text-dim)]">
            <tr>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thay đổi chính</th>
              <th className="px-4 py-3">Ghi chú</th>
              <th className="px-4 py-3">Cập nhật bởi</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3 text-right">Xem</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-t border-[var(--line)]">
                <td className="px-4 py-3 font-semibold">{item.version}</td>
                <td className="px-4 py-3">
                  <Badge tone={mapStatusTone(item.status)}>{item.status}</Badge>
                </td>
                <td className="px-4 py-3">{item.changes}</td>
                <td className="px-4 py-3 text-[var(--text-dim)]">{item.note}</td>
                <td className="px-4 py-3">{item.updatedBy}</td>
                <td className="px-4 py-3">{formatDateTime(item.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/workflow/${workflow.id}`}>
                      <Button variant="secondary" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" /> Diagram
                      </Button>
                    </Link>
                    <Link href={`/workflow/${workflow.id}/preview/session?version=${item.version}`}>
                      <Button size="sm">Preview</Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
