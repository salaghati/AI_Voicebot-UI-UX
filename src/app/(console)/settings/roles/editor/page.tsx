"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRole, fetchRoles, updateRole } from "@/lib/api-client";
import { SettingsShell } from "@/features/settings";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/shared/async-state";
import { cn } from "@/lib/utils";

const permissionActions = [
  { key: "view", label: "View" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "import", label: "Import" },
  { key: "export", label: "Export" },
] as const;

const permissionModules = [
  {
    title: "Bot Engine",
    items: [
      { key: "bot_engine.outbound", label: "Outbound campaign" },
      { key: "bot_engine.inbound", label: "Inbound routing" },
      { key: "bot_engine.call_logs", label: "Danh sách cuộc gọi" },
    ],
  },
  {
    title: "Knowledge Base",
    items: [
      { key: "kb.list", label: "Danh sách KB" },
      { key: "kb.fallback", label: "KB Fallback" },
      { key: "kb.usage", label: "Truy vết sử dụng" },
    ],
  },
  {
    title: "Workflow",
    items: [
      { key: "workflow.list", label: "Danh sách workflow" },
      { key: "workflow.builder", label: "Tạo workflow" },
      { key: "workflow.preview", label: "Preview / Test workflow" },
    ],
  },
  {
    title: "Báo cáo",
    items: [
      { key: "report.overview", label: "Tổng quan" },
      { key: "report.inbound", label: "Báo cáo inbound" },
      { key: "report.outbound", label: "Báo cáo outbound" },
      { key: "report.agent", label: "Phân tích agent" },
      { key: "report.errors", label: "Giám sát lỗi" },
    ],
  },
  {
    title: "Preview/Test",
    items: [
      { key: "preview.playground", label: "Playground kiểm thử" },
    ],
  },
  {
    title: "Settings",
    items: [
      { key: "settings.stt_tts", label: "STT / TTS / VAD" },
      { key: "settings.users", label: "DS người dùng" },
      { key: "settings.api", label: "API Integration" },
      { key: "settings.agent", label: "Agent Handover" },
      { key: "settings.fallback", label: "Fallback hệ thống" },
      { key: "settings.phone_numbers", label: "Quản lý đầu số" },
      { key: "settings.extensions", label: "Quản lý extension" },
      { key: "settings.roles", label: "Phân quyền" },
    ],
  },
] as const;

const allPermissionCodes = permissionModules.flatMap((module) =>
  module.items.flatMap((item) =>
    permissionActions.map((action) => `${item.key}.${action.key}`),
  ),
);

type RoleEditorForm = {
  roleName: string;
  permissions: string[];
};

function normalizePermissions(permissions?: string[]) {
  if (!permissions || permissions.length === 0) {
    return [];
  }
  if (permissions.includes("*")) {
    return allPermissionCodes;
  }
  return permissions;
}

export default function SettingsRoleEditorPage() {
  const router = useRouter();
  const params = useSearchParams();
  const roleId = params.get("role");
  const query = useQuery({ queryKey: ["settings-roles-editor"], queryFn: fetchRoles });

  const selectedRole = useMemo(
    () => query.data?.data.find((role) => role.id === roleId) || null,
    [query.data?.data, roleId],
  );

  const form = useForm<RoleEditorForm>({
    defaultValues: {
      roleName: "",
      permissions: [],
    },
  });

  useEffect(() => {
    form.reset({
      roleName: selectedRole?.roleName || "",
      permissions: normalizePermissions(selectedRole?.permissions),
    });
  }, [form, selectedRole]);

  const watchedPermissions = useWatch({ control: form.control, name: "permissions" });
  const selectedPermissions = useMemo(() => watchedPermissions || [], [watchedPermissions]);
  const selectedSet = useMemo(() => new Set(selectedPermissions), [selectedPermissions]);

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => toast.success("Tạo phân quyền thành công"),
    onError: () => toast.error("Không thể tạo phân quyền"),
  });

  const updateMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => toast.success("Cập nhật phân quyền thành công"),
    onError: () => toast.error("Không thể cập nhật phân quyền"),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const togglePermission = (permissionCode: string, checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...selectedPermissions, permissionCode]))
      : selectedPermissions.filter((item) => item !== permissionCode);
    form.setValue("permissions", next, { shouldDirty: true });
  };

  if (query.isLoading) {
    return (
      <SettingsShell
        title="Phân quyền"
        description="Thiết lập quyền truy cập theo module và submenu"
        section="Phân quyền"
      >
        <AsyncState state="loading" />
      </SettingsShell>
    );
  }

  if (query.isError) {
    return (
      <SettingsShell
        title="Phân quyền"
        description="Thiết lập quyền truy cập theo module và submenu"
        section="Phân quyền"
      >
        <AsyncState state="error" onRetry={() => query.refetch()} />
      </SettingsShell>
    );
  }

  return (
    <SettingsShell
      title="Phân quyền"
      description="Thiết lập quyền truy cập theo module và submenu"
      section="Phân quyền"
    >
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <h3 className="text-[28px] font-semibold leading-none text-[var(--text-main)]">Phân quyền</h3>
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => router.push("/settings/roles")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-xl leading-none text-[var(--text-dim)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text-main)]"
          >
            x
          </button>
        </div>

        <form
          className="space-y-5 px-5 py-5"
          onSubmit={form.handleSubmit((values) => {
            const payload = {
              id: selectedRole?.id || "NEW",
              roleName: values.roleName.trim(),
              permissions: values.permissions,
            };
            if (selectedRole) {
              updateMutation.mutate(payload);
              return;
            }
            createMutation.mutate(payload);
          })}
        >
          <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)] md:items-center">
            <label className="text-sm font-medium text-[var(--text-main)]">Tên phân quyền</label>
            <Input
              {...form.register("roleName", { required: true })}
              placeholder="VD: Supervisor Voicebot"
              className="h-11"
            />
          </div>

          <div className="overflow-hidden border border-[var(--line)]">
            <div className="grid grid-cols-[minmax(280px,1fr)_88px_88px_88px_88px_88px] bg-[var(--surface-2)] px-4 py-3 text-sm font-semibold text-[var(--text-main)]">
              <div />
              {permissionActions.map((action) => (
                <div key={action.key} className="text-center">
                  {action.label}
                </div>
              ))}
            </div>

            {permissionModules.map((module) => (
              <div key={module.title} className="border-t border-[var(--line)] first:border-t-0">
                <div className="bg-[#f7f8fa] px-4 py-3 text-base font-semibold text-[var(--text-main)]">
                  {module.title}
                </div>
                {module.items.map((item, index) => (
                  <div
                    key={item.key}
                    className={cn(
                      "grid grid-cols-[minmax(280px,1fr)_88px_88px_88px_88px_88px] items-center px-4 py-3",
                      index > 0 ? "border-t border-[var(--line)]" : undefined,
                    )}
                  >
                    <div className="text-[15px] text-[var(--text-main)]">+ {item.label}</div>
                    {permissionActions.map((action) => {
                      const permissionCode = `${item.key}.${action.key}`;
                      const checked = selectedSet.has(permissionCode);
                      return (
                        <label
                          key={permissionCode}
                          className="flex items-center justify-center"
                        >
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={checked}
                            onChange={(event) => togglePermission(permissionCode, event.target.checked)}
                          />
                          <span className="flex h-5 w-5 items-center justify-center rounded-[2px] border border-[#c7cad1] bg-white transition peer-checked:border-[#2f80ed] peer-checked:bg-[#2f80ed]">
                            <svg
                              viewBox="0 0 16 16"
                              className={cn(
                                "h-3.5 w-3.5 text-white opacity-0 transition",
                                checked ? "opacity-100" : undefined,
                              )}
                              fill="none"
                              aria-hidden="true"
                            >
                              <path d="M3.2 8.3 6.2 11l6.6-6.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-dim)]">
              Đã bật {selectedPermissions.length} quyền cho role này.
            </p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => router.push("/settings/roles")}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </SettingsShell>
  );
}
