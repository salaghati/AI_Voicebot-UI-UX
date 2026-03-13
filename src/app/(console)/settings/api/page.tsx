"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { fetchApiSettings, updateApiSettings } from "@/lib/api-client";
import { SettingsShell } from "@/features/settings";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { AsyncState } from "@/components/shared/async-state";
import type { ApiEndpointSetting } from "@/types/domain";

export default function SettingsApiPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editedEndpoints, setEditedEndpoints] = useState<ApiEndpointSetting[] | null>(null);
  const form = useForm({
    defaultValues: {
      apiName: "",
      method: "GET",
      url: "",
      authType: "Bearer Token",
      token: "",
      timeout: "3000",
      headerKey: "",
      headerValue: "",
    },
  });
  const query = useQuery({ queryKey: ["settings-api"], queryFn: fetchApiSettings });
  const endpointRows = editedEndpoints ?? query.data?.data.endpoints ?? [];
  const baseSettings = query.data?.data;

  const mutation = useMutation({
    mutationFn: updateApiSettings,
    onSuccess: () => {
      toast.success("Lưu API thành công");
      setOpenModal(false);
      form.reset();
    },
    onError: () => toast.error("Không thể lưu API"),
  });

  return (
    <SettingsShell
      title="API Integration"
      description="Quản lý API endpoints và data mapping cho workflow"
      section="API Integration"
      actions={
        <Button onClick={() => setOpenModal(true)}>
          <Plus className="h-4 w-4" /> Thêm API
        </Button>
      }
    >
      {query.isLoading ? <AsyncState state="loading" /> : null}
      {query.isError ? <AsyncState state="error" onRetry={() => query.refetch()} /> : null}

      {!query.isLoading && !query.isError ? (
        <>
      <Card className="space-y-3">
        <h3 className="text-xl font-bold">API Endpoints</h3>
        <Table>
          <THead>
            <tr>
              <TH>TÊN API</TH>
              <TH>METHOD</TH>
              <TH>TIMEOUT</TH>
              <TH>TRẠNG THÁI</TH>
            </tr>
          </THead>
          <TBody>
            {endpointRows.map((item) => (
              <tr key={item.name}>
                <TD className="font-medium">{item.name}</TD>
                <TD>{item.method}</TD>
                <TD>{item.timeoutMs}ms</TD>
                <TD className={item.status === "connected" ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>
                  {item.status === "connected" ? "Kết nối thành công" : "Mất kết nối"}
                </TD>
              </tr>
            ))}
          </TBody>
        </Table>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-xl font-bold">Data Mapping</h3>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm">
            <p className="font-semibold">Request Template</p>
            <pre className="mt-2 overflow-auto text-xs text-[var(--text-dim)]">
{endpointRows[0]?.requestTemplate || `{
  "customer_id": "{{customer_id}}",
  "query_type": "billing_current",
  "channel": "voicebot"
}`}
            </pre>
          </div>
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm">
            <p className="font-semibold">{"Response -> Câu trả lời"}</p>
            <pre className="mt-2 overflow-auto text-xs text-[var(--text-dim)]">
{endpointRows[0]?.responseTemplate || `Số dư hiện tại của quý khách là {{amount}} đồng.
Hạn thanh toán gần nhất: {{due_date}}.`}
            </pre>
          </div>
        </div>
      </Card>
        </>
      ) : null}

      {openModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <Card className="w-full max-w-4xl space-y-4 rounded-2xl bg-white p-0">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
              <h3 className="text-2xl font-bold">Thêm API</h3>
              <button
                type="button"
                className="rounded-md p-1 text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
                onClick={() => setOpenModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="space-y-4 px-6 pb-6"
              onSubmit={form.handleSubmit((values) => {
                const nextEndpoint: ApiEndpointSetting = {
                  id: `api_${endpointRows.length + 1}`,
                  name: values.apiName,
                  method: values.method as ApiEndpointSetting["method"],
                  url: values.url,
                  authType: values.authType as ApiEndpointSetting["authType"],
                  authProfile: values.token || "custom_auth_profile",
                  timeoutMs: Number(values.timeout) || baseSettings?.timeoutMs || 3000,
                  status: "connected",
                  headerKey: values.headerKey,
                  headerValue: values.headerValue,
                  requestTemplate: '{ "customer_id": "{{customer_id}}" }',
                  responseTemplate: '{ "result": "{{result}}" }',
                };
                const nextEndpoints = [...endpointRows, nextEndpoint];
                setEditedEndpoints(nextEndpoints);
                mutation.mutate({
                  ...(baseSettings ?? { baseUrl: "", timeoutMs: 3000, retry: 2 }),
                  endpoints: nextEndpoints,
                });
              })}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium">Tên API *</label>
                  <Input placeholder="VD: check_inventory_api" {...form.register("apiName")} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Method *</label>
                  <Select {...form.register("method")}>
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">URL *</label>
                  <Input placeholder="https://api.example.com/..." {...form.register("url")} />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium">Auth Type *</label>
                  <Select {...form.register("authType")}>
                    <option>Bearer Token</option>
                    <option>API Key</option>
                    <option>Basic Auth</option>
                  </Select>
                </div>
                <div className="md:col-span-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-3">
                  <p className="mb-2 text-sm font-semibold">Credentials</p>
                  <Input type="password" placeholder="Token" {...form.register("token")} />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium">Timeout (ms) *</label>
                  <Input type="number" {...form.register("timeout")} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Header Key</label>
                  <Input placeholder="Key (e.g. Content-Type)" {...form.register("headerKey")} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Header Value</label>
                  <Input placeholder="Value (e.g. application/json)" {...form.register("headerValue")} />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--line)] pt-4">
                <Button type="button" variant="secondary" onClick={() => toast.success("Kết nối API thành công (mock)")}>
                  Test connection
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => setOpenModal(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </SettingsShell>
  );
}
