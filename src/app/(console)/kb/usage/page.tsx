"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchKbDocs, fetchKbUsage } from "@/lib/api-client";
import { KbShell } from "@/features/kb";
import { Card } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/shared/async-state";

export default function KbUsagePage() {
  const usageQuery = useQuery({ queryKey: ["kb-usage-list"], queryFn: () => fetchKbUsage() });
  const kbQuery = useQuery({ queryKey: ["kb-list"], queryFn: () => fetchKbDocs() });
  const kbMap = useMemo(
    () =>
      new Map((kbQuery.data?.data ?? []).map((item) => [item.id, item.title])),
    [kbQuery.data?.data],
  );
  const isLoading = usageQuery.isLoading || kbQuery.isLoading;
  const isError = usageQuery.isError || kbQuery.isError;

  return (
    <KbShell
      title="KB - 3. Truy vết sử dụng"
      description="Danh sách KB được sử dụng trong các cuộc hội thoại"
      actions={
        <Link href="/kb/usage/filter">
          <Button variant="secondary">Mở màn filter</Button>
        </Link>
      }
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
      {!isLoading && !isError ? (
        <Card>
          <Table>
            <THead>
              <tr>
                <TH>KB</TH>
                <TH>Workflow</TH>
                <TH>Calls</TH>
                <TH>Top intent</TH>
                <TH className="text-right">Chi tiết</TH>
              </tr>
            </THead>
            <TBody>
              {usageQuery.data?.data.map((item) => (
                <tr key={item.id}>
                  <TD>
                    <div className="space-y-1">
                      <p className="font-medium text-[var(--text-main)]">{kbMap.get(item.kbId) ?? item.kbId}</p>
                      <p className="text-xs text-[var(--text-dim)]">KB ID: {item.kbId}</p>
                    </div>
                  </TD>
                  <TD>{item.workflow}</TD>
                  <TD>{item.calls}</TD>
                  <TD>{item.topIntent}</TD>
                  <TD className="text-right">
                    <Link href={`/kb/usage/${item.id}`} className="text-[var(--accent)] underline-offset-4 hover:underline">
                      Xem chi tiết
                    </Link>
                  </TD>
                </tr>
              ))}
            </TBody>
          </Table>
        </Card>
      ) : null}
    </KbShell>
  );
}
