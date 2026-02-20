"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Download, Pencil, Plus, Trash2, Copy, Eye } from "lucide-react";
import { toast } from "sonner";
import type { ApiResult, FilterParams, Paginated } from "@/types/domain";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListControls } from "@/components/shared/list-controls";
import { StateSwitcher } from "@/components/shared/state-switcher";
import { AsyncState } from "@/components/shared/async-state";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { mapStatusTone } from "@/lib/mappers";
import { cn } from "@/lib/utils";

export interface EntityColumn<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
}

interface EntityListPageProps<T extends { id: string; status?: string }> {
  title: string;
  description: string;
  queryKey: string;
  createHref?: string;
  createLabel?: string;
  showCreate?: boolean;
  showRowActions?: boolean;
  statuses?: string[];
  types?: string[];
  tabs?: Array<{ label: string; href: string }>;
  fetcher: (params: FilterParams) => Promise<ApiResult<Paginated<T>>>;
  columns: EntityColumn<T>[];
  detailHref?: (item: T) => string;
}

function readParams(searchParams: URLSearchParams): FilterParams {
  return {
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") || undefined,
    type: searchParams.get("type") || undefined,
    sort: searchParams.get("sort") || undefined,
    page: Number(searchParams.get("page") || "1"),
    pageSize: Number(searchParams.get("pageSize") || "10"),
    state: searchParams.get("state") || undefined,
  };
}

function toMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Có lỗi xảy ra";
}

export function EntityListPage<T extends { id: string; status?: string }>({
  title,
  description,
  queryKey,
  createHref,
  createLabel,
  showCreate = true,
  showRowActions = true,
  statuses,
  types,
  tabs,
  fetcher,
  columns,
  detailHref,
}: EntityListPageProps<T>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(() => readParams(searchParams), [searchParams]);

  const query = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => fetcher(params),
  });

  const message = toMessage(query.error);
  const isForbidden = message.toLowerCase().includes("quyền") || message.includes("403");

  return (
    <div className="space-y-4">
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => toast.success("Đã xuất dữ liệu mẫu")}
              className="gap-2"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            {showCreate && createHref ? (
              <Link href={createHref}>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> {createLabel || "Tạo mới"}
                </Button>
              </Link>
            ) : null}
          </div>
        }
      />

      <Card className="space-y-3">
        {tabs?.length ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[var(--surface-2)] p-1.5">
            {tabs.map((tab) => {
              const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-white text-[#0f557b] shadow-sm"
                      : "text-[var(--text-dim)] hover:bg-white/70",
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        ) : null}
        <ListControls statuses={statuses} types={types} />
        <StateSwitcher />
      </Card>

      {query.isLoading || query.isFetching ? <AsyncState state="loading" /> : null}
      {!query.isLoading && query.isError ? (
        <AsyncState state={isForbidden ? "forbidden" : "error"} message={message} onRetry={() => query.refetch()} />
      ) : null}
      {!query.isLoading && !query.isError && (query.data?.data.items.length ?? 0) === 0 ? (
        <AsyncState state="empty" />
      ) : null}

      {!query.isLoading && !query.isError && (query.data?.data.items.length ?? 0) > 0 ? (
        <Card className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <tr>
                  {columns.map((column) => (
                    <TH key={column.key}>{column.label}</TH>
                  ))}
                  <TH>Trạng thái</TH>
                  {showRowActions ? (
                    <TH className="text-right">Thao tác</TH>
                  ) : detailHref ? (
                    <TH className="text-right">Chi tiết</TH>
                  ) : null}
                </tr>
              </THead>
              <TBody>
                {query.data?.data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--surface-2)]">
                    {columns.map((column) => (
                      <TD key={`${item.id}-${column.key}`}>{column.render(item)}</TD>
                    ))}
                    <TD>
                      {item.status ? (
                        <Badge tone={mapStatusTone(item.status)}>{item.status}</Badge>
                      ) : (
                        <Badge>--</Badge>
                      )}
                    </TD>
                    {showRowActions ? (
                      <TD>
                        <div className="flex items-center justify-end gap-1">
                          {detailHref ? (
                            <Link href={detailHref(item)}>
                              <Button variant="ghost" size="sm" title="Chi tiết">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          ) : null}
                          <Button variant="ghost" size="sm" title="Chỉnh sửa" onClick={() => toast.success("Đã mở chế độ chỉnh sửa") }>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Sao chép" onClick={() => toast.success("Đã copy bản ghi") }>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Xóa"
                            onClick={() => {
                              if (window.confirm("Bạn có chắc muốn xóa bản ghi này?")) {
                                toast.success("Đã xóa bản ghi (mock)");
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TD>
                    ) : detailHref ? (
                      <TD>
                        <div className="flex items-center justify-end">
                          <Link href={detailHref(item)}>
                            <Button variant="ghost" size="sm" title="Chi tiết">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TD>
                    ) : null}
                  </tr>
                ))}
              </TBody>
            </Table>
          </div>
          <Pagination
            total={query.data?.data.total || 0}
            page={query.data?.data.page || 1}
            pageSize={query.data?.data.pageSize || 10}
          />
        </Card>
      ) : null}
    </div>
  );
}
