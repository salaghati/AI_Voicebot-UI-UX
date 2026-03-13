import type {
  AgentMetric,
  AgentSettings,
  ApiSettings,
  ApiResult,
  Campaign,
  CampaignDraft,
  CallReport,
  FilterParams,
  InboundConfig,
  InboundDraft,
  Paginated,
  ReportOverview,
  Workflow,
  WorkflowDraft,
  WorkflowPreviewItem,
  ErrorMetric,
  FallbackRule,
  KbDocument,
  KbFallbackRule,
  RolePermission,
} from "@/types/domain";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    try {
      const payload = await response.json();
      throw new Error(payload.message || `Yêu cầu thất bại (${response.status})`);
    } catch {
      throw new Error(`Yêu cầu thất bại (${response.status})`);
    }
  }

  return response.json();
}

export function buildQuery(params?: FilterParams) {
  const query = new URLSearchParams();
  if (!params) {
    return "";
  }
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export async function login(payload: { email: string; password: string }) {
  return request<ApiResult<{ token: string; user: string }>>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(payload: { email: string }) {
  return request<ApiResult<{ sent: boolean }>>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchCampaigns(params: FilterParams) {
  return request<ApiResult<Paginated<Campaign>>>(`/api/campaigns${buildQuery(params)}`);
}

export async function createCampaign(payload: CampaignDraft) {
  return request<ApiResult<Campaign>>("/api/campaigns", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchCampaign(id: string) {
  return request<ApiResult<Campaign>>(`/api/campaigns/${id}`);
}

export async function fetchInbounds(params: FilterParams) {
  return request<ApiResult<Paginated<InboundConfig>>>(`/api/inbounds${buildQuery(params)}`);
}

export async function createInbound(payload: InboundDraft) {
  return request<ApiResult<InboundConfig>>("/api/inbounds", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchWorkflows(params: FilterParams) {
  return request<ApiResult<Paginated<Workflow>>>(`/api/workflows${buildQuery(params)}`);
}

export async function fetchWorkflow(id: string) {
  return request<ApiResult<Workflow>>(`/api/workflows/${id}`);
}

export async function createWorkflow(payload: WorkflowDraft) {
  return request<ApiResult<Workflow>>("/api/workflows", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateWorkflow(id: string, payload: WorkflowDraft) {
  return request<ApiResult<Workflow>>(`/api/workflows/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function toggleWorkflowStatus(id: string) {
  return request<ApiResult<Workflow>>(`/api/workflows/${id}`, {
    method: "PATCH",
  });
}

export async function fetchWorkflowPreview(id: string, tab: string, params?: FilterParams) {
  const query = new URLSearchParams(buildQuery(params).replace("?", ""));
  query.set("tab", tab);
  return request<ApiResult<WorkflowPreviewItem[]>>(`/api/workflows/${id}/preview?${query.toString()}`);
}

export async function fetchReportOverview(params?: FilterParams) {
  return request<ApiResult<ReportOverview>>(`/api/reports/overview${buildQuery(params)}`);
}

export async function fetchInboundReports(params: FilterParams) {
  return request<ApiResult<Paginated<CallReport>>>(`/api/reports/inbound${buildQuery(params)}`);
}

export async function fetchOutboundReports(params: FilterParams) {
  return request<ApiResult<Paginated<CallReport>>>(`/api/reports/outbound${buildQuery(params)}`);
}

export async function fetchCallReport(id: string) {
  return request<ApiResult<CallReport>>(`/api/reports/calls/${id}`);
}

export async function fetchErrorMetrics(params?: FilterParams) {
  return request<ApiResult<ErrorMetric[]>>(`/api/reports/errors${buildQuery(params)}`);
}

export async function fetchAgentMetrics(params: FilterParams) {
  return request<ApiResult<Paginated<AgentMetric>>>(`/api/reports/agents${buildQuery(params)}`);
}

export async function fetchKbDocs(params?: FilterParams) {
  return request<ApiResult<KbDocument[]>>(`/api/kb${buildQuery(params)}`);
}

export async function fetchKbDoc(id: string) {
  return request<ApiResult<KbDocument>>(`/api/kb/${id}`);
}

export async function createKbDoc(payload: Record<string, unknown>) {
  return request<ApiResult<KbDocument>>("/api/kb", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateKbDoc(id: string, payload: Record<string, unknown>) {
  return request<ApiResult<KbDocument>>(`/api/kb/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteKbDoc(id: string) {
  return request<ApiResult<{ success: boolean }>>(`/api/kb/${id}`, {
    method: "DELETE",
  });
}

export async function fetchKbUsage(params?: FilterParams) {
  return request<
    ApiResult<Array<{ id: string; kbId: string; workflow: string; calls: number; topIntent: string }>>
  >(`/api/kb/usage${buildQuery(params)}`);
}

export async function fetchKbFallbackRules() {
  return request<ApiResult<KbFallbackRule[]>>("/api/kb/fallback");
}

export async function fetchKbFallbackRule(id: string) {
  return request<ApiResult<KbFallbackRule>>(`/api/kb/fallback/${id}`);
}

export async function createKbFallbackRule(payload: Record<string, unknown>) {
  return request<ApiResult<KbFallbackRule>>("/api/kb/fallback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateKbFallbackRule(id: string, payload: Record<string, unknown>) {
  return request<ApiResult<KbFallbackRule>>(`/api/kb/fallback/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteKbFallbackRule(id: string) {
  return request<ApiResult<{ success: boolean }>>(`/api/kb/fallback/${id}`, {
    method: "DELETE",
  });
}

export async function toggleKbFallbackActive(id: string) {
  return request<ApiResult<KbFallbackRule>>(`/api/kb/fallback/${id}`, {
    method: "PATCH",
  });
}

export async function fetchActiveKbFallbackRules() {
  return request<ApiResult<KbFallbackRule[]>>("/api/kb/fallback?active=true");
}

export async function fetchSttTtsSettings() {
  return request<
    ApiResult<{
      sttProvider: string;
      ttsProvider: string;
      vad: boolean;
      voice: string;
    }>
  >("/api/settings/stt-tts");
}

export async function updateSttTtsSettings(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/stt-tts", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function fetchApiSettings() {
  return request<ApiResult<ApiSettings>>("/api/settings/api");
}

export async function updateApiSettings(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/api", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function fetchAgentSettings() {
  return request<ApiResult<AgentSettings>>("/api/settings/agent");
}

export async function updateAgentSettings(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/agent", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function fetchFallbackSettings() {
  return request<ApiResult<FallbackRule[]>>("/api/settings/fallback");
}

export async function updateFallbackSettings(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/fallback", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function fetchUsers() {
  return request<
    ApiResult<Array<{ id: string; name: string; email: string; role: string }>>
  >("/api/settings/users");
}

export async function createUser(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateUser(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/users", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteUser() {
  return request<ApiResult<{ success: boolean }>>("/api/settings/users", {
    method: "DELETE",
  });
}

export async function fetchRoles() {
  return request<ApiResult<RolePermission[]>>("/api/settings/roles");
}

export async function createRole(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRole(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/roles", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteRole() {
  return request<ApiResult<{ success: boolean }>>("/api/settings/roles", {
    method: "DELETE",
  });
}

export async function fetchPhoneNumbers() {
  return request<
    ApiResult<Array<{ id: string; number: string; context: string }>>
  >("/api/settings/phone-numbers");
}

export async function createPhoneNumber(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/phone-numbers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deletePhoneNumber() {
  return request<ApiResult<{ success: boolean }>>("/api/settings/phone-numbers", {
    method: "DELETE",
  });
}

export async function fetchExtensions() {
  return request<
    ApiResult<Array<{ id: string; extension: string; outboundCid: string; password: string }>>
  >("/api/settings/extensions");
}

export async function createExtension(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/extensions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateExtension(payload: Record<string, unknown>) {
  return request<ApiResult<Record<string, unknown>>>("/api/settings/extensions", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
