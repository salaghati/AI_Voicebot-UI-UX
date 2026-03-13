export type AsyncState = "loading" | "empty" | "error" | "forbidden" | "ready";

export interface ApiResult<T> {
  data: T;
  message?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  state?: string;
  nodeId?: string;
}

export type CampaignStatus = "Nháp" | "Đang chạy" | "Tạm dừng" | "Hoàn tất";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  source: string;
  workflow: string;
  handoverEnabled?: boolean;
  defaultHandoverProfileId?: string;
  totalCalls: number;
  successRate: number;
  owner: string;
  createdAt: string;
}

export interface CampaignDraft {
  name: string;
  source: string;
  workflow: string;
  handoverEnabled?: boolean;
  defaultHandoverProfileId?: string;
  schedule: string;
  callerId: string;
  retryRule: string;
  note: string;
}

export type InboundStatus = "Hoạt động" | "Nháp" | "Tắt";

export interface InboundConfig {
  id: string;
  name: string;
  queue: string;
  extension: string;
  workflow: string;
  fallback: string;
  handoverTo: string;
  defaultHandoverProfileId?: string;
  status: InboundStatus;
  updatedAt: string;
}

export interface InboundDraft {
  name: string;
  queue: string;
  extension: string;
  workflow: string;
  fallback: string;
  handoverTo: string;
  defaultHandoverProfileId?: string;
  note: string;
}

export type WorkflowNodeType =
  | "Start"
  | "Prompt"
  | "Intent"
  | "Condition"
  | "API"
  | "KB"
  | "Handover"
  | "End";

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  value: string;
  x?: number;
  y?: number;
  ttsText?: string;
  intents?: string[];
  entities?: string[];

  // Intent node
  mainIntent?: string;
  confidenceThreshold?: number;
  fallbackNodeId?: string;
  repromptText?: string;
  timeoutSec?: number;
  maxRetry?: number;

  // Condition node
  conditionSource?: "intent" | "entity" | "context" | "api_result";
  conditionRulesText?: string;
  defaultTargetNodeId?: string;
  onRuleError?: "fallback" | "end_call" | "transfer_agent";

  // API node
  apiRef?: string;
  apiMethod?: "GET" | "POST" | "PUT" | "DELETE";
  apiUrl?: string;
  authProfile?: string;
  apiTimeoutMs?: number;
  apiRetry?: number;
  successCondition?: string;
  requestMapping?: string;
  responseMapping?: string;
  onFailAction?: "retry" | "fallback" | "transfer_agent" | "end_call";

  // KB node
  retrievalMode?: "semantic" | "keyword" | "hybrid";
  topK?: number;
  scoreThreshold?: number;
  rerank?: boolean;
  promptTemplate?: string;
  citationEnabled?: boolean;
  noAnswerAction?: "fallback_node" | "ask_again" | "transfer_agent" | "end_call";

  // Handover node
  handoverMode?: "use_default" | "override_profile";
  handoverProfileId?: string;
  handoverTarget?: string;
  handoverMessage?: string;
  onHandoverFail?: "fallback_node" | "retry_transfer" | "end_call";

  // End node
  endReason?: string;
}

export interface Workflow {
  id: string;
  name: string;
  status: "Active" | "Draft";
  kind: "Inbound" | "Outbound" | "Playground";
  version: string;
  updatedAt: string;
  intents: string[];
  nodes: WorkflowNode[];
}

export interface WorkflowDraft {
  name: string;
  kind: "Inbound" | "Outbound" | "Playground";
  status: "Active" | "Draft";
  intents: string[];
  nodes: WorkflowNode[];
}

export interface WorkflowPreviewItem {
  time: string;
  speaker: string;
  content: string;
  confidence?: number;
  nodeId?: string;
  nodeLabel?: string;
}

export interface ReportOverview {
  totalCalls: number;
  successCalls: number;
  failedCalls: number;
  avgDurationSec: number;
  conversionRate: number;
}

export interface CallReport {
  id: string;
  customerPhone: string;
  campaign: string;
  workflow: string;
  intent: string;
  durationSec: number;
  status: "Success" | "Failed" | "Transferred";
  startAt: string;
  transcript: WorkflowPreviewItem[];
  entities: Array<{ key: string; value: string }>;
}

export interface ErrorMetric {
  id: string;
  type: string;
  count: number;
  trend: "up" | "down";
}

export interface AgentMetric {
  id: string;
  agentName: string;
  handledCalls: number;
  avgHandleTime: number;
  transferRate: number;
  csat: number;
}

export interface AgentGroup {
  id: string;
  name: string;
  description?: string;
  priority: "Cao" | "Trung bình" | "Đặc biệt";
  maxWaitSec: number;
  callbackAllowed: boolean;
  active: boolean;
  agents: number;
}

export interface HandoverProfile {
  id: string;
  name: string;
  targetType: "agent_group" | "queue";
  targetRefId: string;
  contextTemplateId: string;
  failAction: "retry_transfer" | "fallback_node" | "end_call" | "callback";
  active: boolean;
  description?: string;
}

export interface AgentSettings {
  transferCondition: string;
  transferContext: string[];
  queue: string;
  groups: AgentGroup[];
  handoverProfiles: HandoverProfile[];
  globalPolicy: {
    escapeIntents: string[];
    escapeKeywords: string[];
    repeatThreshold: number;
  };
}

export interface ApiEndpointSetting {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  authType: "Bearer Token" | "API Key" | "Basic Auth";
  authProfile: string;
  timeoutMs: number;
  status: "connected" | "disconnected";
  headerKey?: string;
  headerValue?: string;
  requestTemplate?: string;
  responseTemplate?: string;
}

export interface ApiSettings {
  baseUrl: string;
  timeoutMs: number;
  retry: number;
  endpoints: ApiEndpointSetting[];
}

export type KbTrainingStatus = "Đã học" | "Chưa học" | "Đang học";

export type KbSourceType = "url" | "article" | "file";

export interface KbDocument {
  id: string;
  title: string;
  source: string;
  sourceType: KbSourceType;
  status: KbTrainingStatus;
  version: string;
  updatedAt: string;
  url?: string;
  displayName?: string;
  crawlMode?: "Single Page" | "Entire Site";
  pageLimit?: number;
  patterns?: string;
  articleTitle?: string;
  articleContent?: string;
  articleTags?: string[];
  fileName?: string;
  fileTypes?: string;
  chunkingMode?: "Auto (Recommended)" | "Small chunk" | "Large chunk";
}

export interface FallbackRule {
  id: string;
  name: string;
  action: string;
  waitSec: number;
}

export interface KbFallbackRule {
  id: string;
  name: string;
  category: "NLU_NO_MATCH" | "SUPPORT_REQUEST" | "GREETING" | "END_CONVERSATION";
  status: KbTrainingStatus;
  active: boolean;
  responseText: string;
  ttsText: string;
  nextAction: "ASK_AGAIN" | "END_CALL" | "CALLBACK" | "TRANSFER_AGENT";
  targetMode: "PRESET" | "OVERRIDE";
  targetQueue: string;
  maxWaitSec: number;
  onFailAction: "PLAY_ERROR_MESSAGE" | "RETRY_TRANSFER" | "END_CALL" | "GO_TO_MAIN_MENU";
  updatedAt: string;
}

export interface RolePermission {
  id: string;
  roleName: string;
  permissions: string[];
}
