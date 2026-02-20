"use client";

import { useState } from "react";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchExtensions } from "@/lib/api-client";
import { SettingsShell } from "@/features/settings";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { AsyncState } from "@/components/shared/async-state";

export default function SettingsExtensionsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const query = useQuery({ queryKey: ["settings-extensions"], queryFn: fetchExtensions });
  const allExtensions = query.data?.data ?? [];

  const totalPages = Math.max(1, Math.ceil(allExtensions.length / pageSize));
  const paginated = allExtensions.slice((page - 1) * pageSize, page * pageSize);

  const togglePassword = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <SettingsShell
      title="Quản lý Extension"
      description="Cấu hình extension, Outbound CID và mật khẩu"
      section="Extension"
    >
      <Card className="space-y-4">
        {query.isLoading ? <AsyncState state="loading" /> : null}
        {query.isError ? <AsyncState state="error" onRetry={() => query.refetch()} /> : null}

        {!query.isLoading && !query.isError ? (
          <>
            <Table>
              <THead>
                <tr>
                  <TH className="w-28">Extension</TH>
                  <TH>Outbound CID</TH>
                  <TH>Password</TH>
                  <TH className="w-24 text-right">Action</TH>
                </tr>
              </THead>
              <TBody>
                {paginated.map((item) => {
                  const isVisible = visiblePasswords.has(item.id);
                  return (
                    <tr key={item.id}>
                      <TD className="font-medium">{item.extension}</TD>
                      <TD>
                        <Input
                          defaultValue={item.outboundCid}
                          placeholder=""
                          className="max-w-80 border-[var(--line)] bg-white"
                          readOnly
                        />
                      </TD>
                      <TD>
                        <Input
                          type={isVisible ? "text" : "password"}
                          defaultValue={item.password}
                          className="max-w-80 border-[var(--line)] bg-white"
                          readOnly
                        />
                      </TD>
                      <TD className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => togglePassword(item.id)}
                            className="rounded-md p-1.5 text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
                            title={isVisible ? "Ẩn password" : "Xem password"}
                          >
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.success(`Đang chỉnh sửa extension ${item.extension} (mock)`)}
                            className="rounded-md p-1.5 text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </TD>
                    </tr>
                  );
                })}
                {paginated.length === 0 ? (
                  <tr>
                    <TD colSpan={4} className="text-center text-[var(--text-dim)]">Không có extension nào.</TD>
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
                  Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, allExtensions.length)} của {allExtensions.length}
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
