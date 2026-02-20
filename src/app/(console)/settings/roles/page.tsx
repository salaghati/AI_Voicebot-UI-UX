"use client";

import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteRole, fetchRoles } from "@/lib/api-client";
import { SettingsShell } from "@/features/settings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/shared/async-state";

export default function SettingsRolesPage() {
  const query = useQuery({ queryKey: ["settings-roles"], queryFn: fetchRoles });
  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => toast.success("Đã xóa phân quyền (mock)"),
    onError: () => toast.error("Không thể xóa phân quyền"),
  });

  return (
    <SettingsShell
      title="Phân quyền"
      description="Danh sách role và cấu hình ma trận quyền truy cập"
      section="Phân quyền"
      actions={
        <Link href="/settings/roles/editor">
          <Button>Thêm mới phân quyền</Button>
        </Link>
      }
    >
      {query.isLoading ? <AsyncState state="loading" /> : null}
      {query.isError ? <AsyncState state="error" onRetry={() => query.refetch()} /> : null}
      {!query.isLoading && !query.isError ? (
        <div className="grid gap-3">
          {query.data?.data.map((role) => (
            <Card key={role.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{role.roleName}</h3>
                <div className="flex gap-2">
                  <Link href={`/settings/roles/editor?role=${role.id}`}>
                    <Button size="sm" variant="secondary">Sửa</Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (window.confirm(`Xóa role ${role.roleName}?`)) {
                        deleteMutation.mutate();
                      }
                    }}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
              <p className="text-sm text-[var(--text-dim)]">
                {role.permissions.includes("*")
                  ? "Toàn quyền trên toàn bộ module AI Voicebot"
                  : `${role.permissions.length} quyền đang được bật`}
              </p>
            </Card>
          ))}
        </div>
      ) : null}
    </SettingsShell>
  );
}
