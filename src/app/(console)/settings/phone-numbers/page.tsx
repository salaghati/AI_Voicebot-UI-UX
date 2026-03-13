"use client";

import { useMemo, useState } from "react";
import { Download, RefreshCw, Search, Trash2, Upload } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchPhoneNumbers } from "@/lib/api-client";
import { SettingsShell } from "@/features/settings";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { AsyncState } from "@/components/shared/async-state";

export default function SettingsPhoneNumbersPage() {
  const [context, setContext] = useState("from-dohuudien2");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: ["settings-phone-numbers"], queryFn: fetchPhoneNumbers });

  const filtered = useMemo(() => {
    const allNumbers = query.data?.data ?? [];
    const q = searchQuery.trim().toLowerCase();
    return allNumbers.filter(
      (item) => item.context === context && (!q || item.number.includes(q)),
    );
  }, [context, query.data?.data, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleAdd = () => {
    if (!newNumber.trim()) {
      toast.error("Nhập số điện thoại trước.");
      return;
    }
    toast.success(`Đã thêm ${newNumber} vào ${context} (mock)`);
    setNewNumber("");
  };

  return (
    <SettingsShell
      title="Quản lý đầu số"
      description="Danh sách số outbound/inbound, thêm số và áp dụng cấu hình"
      section="Quản lý đầu số"
    >
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={context} onChange={(e) => { setContext(e.target.value); setPage(1); }} className="w-52">
            <option value="from-dohuudien2">from-dohuudien2</option>
            <option value="from-outbound-main">from-outbound-main</option>
            <option value="from-inbound-cskh">from-inbound-cskh</option>
          </Select>

          <Button variant="secondary" className="gap-1.5" onClick={() => toast.success("Import thành công (mock)")}>
            <Download className="h-4 w-4" /> Import
          </Button>
          <Button variant="secondary" className="gap-1.5" onClick={() => toast.success("Export thành công (mock)")}>
            <Upload className="h-4 w-4" /> Export
          </Button>
          <Button variant="secondary" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["settings-phone-numbers"] })}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          <div className="flex flex-1 items-center gap-2">
            <Input
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              placeholder="Nhập số điện thoại"
              className="max-w-52"
            />
            <Button onClick={handleAdd}>+ Add</Button>
          </div>

          <Button onClick={() => toast.success("Apply Config thành công (mock)")}>
            Apply Config
          </Button>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--text-dim)]" />
            <Input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Tìm..."
              className="w-40 pl-9"
            />
          </div>
        </div>

        {query.isLoading ? <AsyncState state="loading" /> : null}
        {query.isError ? <AsyncState state="error" onRetry={() => query.refetch()} /> : null}

        {!query.isLoading && !query.isError ? (
          <>
            <Table>
              <THead>
                <tr>
                  <TH>Phone Number</TH>
                  <TH className="w-24 text-right">Action</TH>
                </tr>
              </THead>
              <TBody>
                {paginated.map((item) => (
                  <tr key={item.id}>
                    <TD>{item.number}</TD>
                    <TD className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Xóa số ${item.number}?`)) {
                            toast.success(`Đã xóa ${item.number} (mock)`);
                          }
                        }}
                        className="rounded-md bg-red-600 p-1.5 text-white hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TD>
                  </tr>
                ))}
                {paginated.length === 0 ? (
                  <tr>
                    <TD colSpan={2} className="text-center text-[var(--text-dim)]">Không có số nào.</TD>
                  </tr>
                ) : null}
              </TBody>
            </Table>

            <div className="flex items-center justify-between text-sm">
              <Select value={String(pageSize)} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="w-20">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </Select>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setPage(1)} disabled={page === 1}>Đầu</Button>
                <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Trước</Button>
                <span className="text-[var(--text-dim)]">
                  Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} của {filtered.length}
                </span>
                <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Sau</Button>
                <Button variant="secondary" size="sm" onClick={() => setPage(totalPages)} disabled={page >= totalPages}>Cuối</Button>
              </div>
            </div>
          </>
        ) : null}
      </Card>
    </SettingsShell>
  );
}
