"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { createUser, deleteUser, fetchUsers } from "@/lib/api-client";
import { SettingsShell } from "@/features/settings";
import { Card } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AsyncState } from "@/components/shared/async-state";

export default function SettingsUsersPage() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const query = useQuery({ queryKey: ["settings-users"], queryFn: fetchUsers });
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Super Admin",
      status: "Active",
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => toast.success("Xóa user thành công (mock)"),
    onError: () => toast.error("Xóa thất bại"),
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("Tạo user thành công");
      setOpenCreateModal(false);
      form.reset();
      query.refetch();
    },
    onError: () => toast.error("Không thể tạo user"),
  });

  const rows = useMemo(() => {
    return (
      query.data?.data.map((item, index) => ({
        ...item,
        status: index < 3 ? "Active" : "Inactive",
        lastLogin: index === 0 ? "21/01/2026 09:00" : index === 1 ? "21/01/2026 08:45" : "20/01/2026 17:30",
      })) || []
    );
  }, [query.data?.data]);

  return (
    <SettingsShell
      title="Quản lý người dùng"
      description="Danh sách user, phân quyền và trạng thái đăng nhập"
      section="Người dùng"
      actions={
        <Button onClick={() => setOpenCreateModal(true)}>+ Thêm user</Button>
      }
    >
      {query.isLoading ? <AsyncState state="loading" /> : null}
      {query.isError ? <AsyncState state="error" onRetry={() => query.refetch()} /> : null}
      {!query.isLoading && !query.isError ? (
        <Card>
          <Table>
            <THead>
              <tr>
                <TH>TÊN</TH>
                <TH>EMAIL</TH>
                <TH>VAI TRÒ</TH>
                <TH>TRẠNG THÁI</TH>
                <TH>ĐĂNG NHẬP CUỐI</TH>
                <TH className="text-right">THAO TÁC</TH>
              </tr>
            </THead>
            <TBody>
              {rows.map((item) => (
                <tr key={item.id}>
                  <TD>{item.name}</TD>
                  <TD>{item.email}</TD>
                  <TD>{item.role}</TD>
                  <TD className={item.status === "Active" ? "font-semibold text-emerald-600" : "font-semibold text-slate-500"}>
                    {item.status}
                  </TD>
                  <TD>{item.lastLogin}</TD>
                  <TD className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toast.success(`Mở sửa ${item.name} (mock)`)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Xóa user ${item.name}?`)) {
                            deleteMutation.mutate();
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TD>
                </tr>
              ))}
            </TBody>
          </Table>
          <p className="mt-4 text-sm text-[var(--text-dim)]">
            Hiển thị {rows.length} trong tổng số 12 người dùng
          </p>
        </Card>
      ) : null}

      {openCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <Card className="w-full max-w-3xl space-y-4 rounded-2xl bg-white p-0">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
              <h3 className="text-2xl font-bold">Thêm User mới</h3>
              <button
                type="button"
                className="rounded-md p-1 text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
                onClick={() => setOpenCreateModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="space-y-4 px-6 pb-6"
              onSubmit={form.handleSubmit((values) => {
                if (values.password !== values.confirmPassword) {
                  toast.error("Mật khẩu xác nhận chưa khớp");
                  return;
                }
                createMutation.mutate(values);
              })}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Họ tên *</label>
                  <Input placeholder="Nhập họ tên" {...form.register("name", { required: true })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Email *</label>
                  <Input type="email" placeholder="email@mitek.com" {...form.register("email", { required: true })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Mật khẩu *</label>
                  <Input type="password" placeholder="••••••••" {...form.register("password", { required: true })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Xác nhận mật khẩu *</label>
                  <Input type="password" placeholder="••••••••" {...form.register("confirmPassword", { required: true })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Vai trò *</label>
                  <Select {...form.register("role")}>
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Trạng thái</label>
                  <div className="mt-2 flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" value="Active" {...form.register("status")} />
                      Active
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" value="Inactive" {...form.register("status")} />
                      Inactive
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-4">
                <Button type="button" variant="secondary" onClick={() => setOpenCreateModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Đang tạo..." : "Tạo User"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </SettingsShell>
  );
}
