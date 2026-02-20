import type {
  AgentMetric,
  Campaign,
  CampaignDraft,
  CallReport,
  FilterParams,
  InboundConfig,
  InboundDraft,
  ReportOverview,
  Workflow,
  WorkflowDraft,
  WorkflowPreviewItem,
  ErrorMetric,
} from "@/types/domain";
import { applyFilter, applySort, paginate } from "@/lib/query-utils";

const now = Date.now();

const campaigns: Campaign[] = [
  {
    id: "CMP-1001",
    name: "Nhắc lịch thanh toán tháng 2",
    status: "Đang chạy",
    source: "CRM khách hàng quá hạn",
    workflow: "WF_ThuNo_A",
    totalCalls: 1250,
    successRate: 68.4,
    owner: "Minh Pham",
    createdAt: new Date(now - 86400000 * 7).toISOString(),
  },
  {
    id: "CMP-1002",
    name: "Cross-sell gói Premium",
    status: "Tạm dừng",
    source: "Segment người dùng active",
    workflow: "WF_CrossSell_B",
    totalCalls: 870,
    successRate: 43.9,
    owner: "Trang Le",
    createdAt: new Date(now - 86400000 * 15).toISOString(),
  },
  {
    id: "CMP-1003",
    name: "Khảo sát hài lòng sau hỗ trợ",
    status: "Nháp",
    source: "Ticket đã đóng",
    workflow: "WF_CSAT",
    totalCalls: 0,
    successRate: 0,
    owner: "Anh Nguyen",
    createdAt: new Date(now - 86400000 * 1).toISOString(),
  },
  {
    id: "CMP-1004",
    name: "Nhắc gia hạn bảo hiểm",
    status: "Hoàn tất",
    source: "Danh sách hợp đồng sắp hết hạn",
    workflow: "WF_GiaHan",
    totalCalls: 2210,
    successRate: 74.1,
    owner: "Linh Ho",
    createdAt: new Date(now - 86400000 * 31).toISOString(),
  },
];

const inbounds: InboundConfig[] = [
  {
    id: "INB-201",
    name: "Hotline hỗ trợ thanh toán",
    queue: "queue_payment",
    extension: "801",
    workflow: "WF_ThanhToan",
    fallback: "Chuyển tổng đài viên",
    handoverTo: "CS Team A",
    status: "Hoạt động",
    updatedAt: new Date(now - 86400000 * 2).toISOString(),
  },
  {
    id: "INB-202",
    name: "Hotline đổi lịch giao hàng",
    queue: "queue_delivery",
    extension: "812",
    workflow: "WF_DoiLich",
    fallback: "Gọi lại sau 2 phút",
    handoverTo: "Ops Team B",
    status: "Nháp",
    updatedAt: new Date(now - 86400000 * 5).toISOString(),
  },
  {
    id: "INB-203",
    name: "Hotline khiếu nại",
    queue: "queue_complaint",
    extension: "822",
    workflow: "WF_KhieuNai",
    fallback: "Chuyển supervisor",
    handoverTo: "Escalation Team",
    status: "Tắt",
    updatedAt: new Date(now - 86400000 * 14).toISOString(),
  },
];

const workflows: Workflow[] = [
  {
    id: "WF_ThuNo_A",
    name: "Thu nợ chuẩn A",
    status: "Active",
    kind: "Outbound",
    version: "v2.3",
    updatedAt: new Date(now - 86400000 * 2).toISOString(),
    intents: ["Xác nhận thanh toán", "Xin gia hạn", "Từ chối"],
    nodes: [
      { id: "n1", type: "Intent", label: "Mở đầu", value: "Chào và xác thực" },
      { id: "n2", type: "API", label: "Tra dư nợ", value: "GET /debt/:id" },
      { id: "n3", type: "KB", label: "Giải thích phí", value: "KB_FEE_01" },
      { id: "n4", type: "Condition", label: "Điều hướng", value: "Theo intent" },
    ],
  },
  {
    id: "WF_CrossSell_B",
    name: "Cross-sell Premium",
    status: "Draft",
    kind: "Outbound",
    version: "v1.8",
    updatedAt: new Date(now - 86400000 * 6).toISOString(),
    intents: ["Quan tâm", "Không quan tâm", "Cần tư vấn"],
    nodes: [
      { id: "n1", type: "Intent", label: "Giới thiệu", value: "Mở đầu ưu đãi" },
      { id: "n2", type: "KB", label: "FAQ", value: "KB_PREMIUM_FAQ" },
      { id: "n3", type: "Condition", label: "Chuyển nhánh", value: "Theo mức quan tâm" },
    ],
  },
  {
    id: "WF_ThanhToan",
    name: "Inbound hỗ trợ thanh toán",
    status: "Active",
    kind: "Inbound",
    version: "v3.0",
    updatedAt: new Date(now - 86400000 * 1).toISOString(),
    intents: ["Hỏi phương thức", "Báo lỗi giao dịch", "Gặp agent"],
    nodes: [
      { id: "n1", type: "Intent", label: "Thu intent", value: "STT + classifier" },
      { id: "n2", type: "API", label: "Tra trạng thái", value: "GET /payment/status" },
      { id: "n3", type: "Condition", label: "Fallback", value: "Handover khi cần" },
    ],
  },
  {
    id: "WF_Mau_HoanChinh",
    name: "Mẫu hoàn chỉnh Outbound CSKH",
    status: "Draft",
    kind: "Outbound",
    version: "v1.0",
    updatedAt: new Date(now - 3600000 * 5).toISOString(),
    intents: ["payment_check", "complaint", "handover_request", "other"],
    nodes: [
      {
        id: "node_start",
        type: "Intent",
        label: "START",
        value: "Bắt đầu workflow",
        x: 36,
        y: 34,
        ttsText: "Bắt đầu workflow",
        mainIntent: "greeting",
        confidenceThreshold: 0.8,
        fallbackNodeId: "node_greeting",
        repromptText: "Xin chào, hệ thống bắt đầu cuộc gọi.",
        timeoutSec: 5,
        maxRetry: 1,
      },
      {
        id: "node_greeting",
        type: "Intent",
        label: "LỜI CHÀO",
        value: "Xin chào anh/chị, em là AI Voicebot hỗ trợ thanh toán.",
        x: 36,
        y: 156,
        ttsText: "Xin chào anh chị, em là AI Voicebot hỗ trợ thanh toán.",
        intents: ["payment_check", "complaint", "handover_request"],
        entities: ["customer_id"],
        mainIntent: "payment_check",
        confidenceThreshold: 0.82,
        fallbackNodeId: "node_kb",
        repromptText: "Anh/chị cần hỗ trợ thanh toán hay cần gặp nhân viên ạ?",
        timeoutSec: 7,
        maxRetry: 2,
      },
      {
        id: "node_kb",
        type: "KB",
        label: "TRA CỨU KB",
        value: "Tra tri thức về quy trình thanh toán trễ hạn.",
        x: 36,
        y: 278,
        ttsText: "Em đang tra cứu thông tin hỗ trợ phù hợp cho anh chị.",
        kbRefId: "KB-100",
        retrievalMode: "hybrid",
        topK: 3,
        scoreThreshold: 0.75,
        rerank: true,
        citationEnabled: true,
        promptTemplate: "Tóm tắt quy trình thanh toán trễ hạn ngắn gọn, dễ hiểu.",
        noAnswerAction: "fallback_node",
      },
      {
        id: "node_condition",
        type: "Condition",
        label: "PHÂN LOẠI INTENT",
        value: "Điều hướng theo intent sau khi chào.",
        x: 36,
        y: 400,
        intents: ["payment_check", "complaint", "handover_request", "other"],
        conditionSource: "intent",
        conditionRulesText:
          "intent == payment_check -> node_api\nintent == complaint -> node_handover\nintent == handover_request -> node_handover",
        defaultTargetNodeId: "node_end",
        onRuleError: "fallback",
      },
      {
        id: "node_api",
        type: "API",
        label: "GỌI API DƯ NỢ",
        value: "Gọi API tra cứu số tiền cần thanh toán.",
        x: 298,
        y: 522,
        ttsText: "Em đang tra cứu số tiền cần thanh toán của anh chị.",
        entities: ["customer_id"],
        apiRef: "tra_cuoc_api",
        apiMethod: "GET",
        apiUrl: "/billing/current",
        authProfile: "billing_service_token",
        apiTimeoutMs: 3000,
        apiRetry: 2,
        successCondition: "status == 200",
        requestMapping: '{ \"customer_id\": \"{{customer_id}}\", \"query_type\": \"billing_current\" }',
        responseMapping: '{ \"balance\": \"$.data.balance\", \"due_date\": \"$.data.due_date\" }',
        onFailAction: "fallback",
      },
      {
        id: "node_handover",
        type: "Condition",
        label: "CHUYỂN AGENT",
        value: "Chuyển cuộc gọi cho tổng đài viên khi khách yêu cầu.",
        x: 298,
        y: 644,
        conditionSource: "context",
        conditionRulesText: "handover_required == true -> transfer_agent",
        defaultTargetNodeId: "node_end",
        onRuleError: "transfer_agent",
      },
      {
        id: "node_end",
        type: "Condition",
        label: "KẾT THÚC",
        value: "Cảm ơn anh/chị, chúc anh/chị một ngày tốt lành.",
        x: 84,
        y: 766,
        conditionSource: "context",
        conditionRulesText: "is_end == true -> END",
        onRuleError: "end_call",
      },
    ],
  },
];

const previewData: Record<string, Record<string, WorkflowPreviewItem[]>> = {
  WF_ThuNo_A: {
    session: [
      { time: "09:00:01", speaker: "System", content: "Bắt đầu phiên call CMP-1001", nodeId: "n1", nodeLabel: "Mở đầu" },
      { time: "09:00:05", speaker: "Bot", content: "Em chào anh/chị, em gọi để nhắc lịch thanh toán.", nodeId: "n1", nodeLabel: "Mở đầu" },
      { time: "09:00:08", speaker: "System", content: "Tra cứu dư nợ khách hàng", nodeId: "n2", nodeLabel: "Tra dư nợ" },
      { time: "09:00:11", speaker: "System", content: "Điều hướng theo intent khách hàng", nodeId: "n4", nodeLabel: "Điều hướng" },
    ],
    conversation: [
      { time: "09:00:06", speaker: "Khách", content: "Tôi muốn biết số tiền cần trả.", confidence: 0.96, nodeId: "n1", nodeLabel: "Mở đầu" },
      { time: "09:00:09", speaker: "Bot", content: "Số tiền hiện tại là 1.200.000đ.", nodeId: "n2", nodeLabel: "Tra dư nợ" },
      { time: "09:00:12", speaker: "Khách", content: "Nếu trễ hạn thì phí thế nào?", confidence: 0.94, nodeId: "n3", nodeLabel: "Giải thích phí" },
      { time: "09:00:15", speaker: "Bot", content: "Em giải thích điều kiện phí chậm thanh toán.", nodeId: "n3", nodeLabel: "Giải thích phí" },
    ],
    kb: [
      { time: "09:00:13", speaker: "KB", content: "Doc: Chính sách thanh toán trễ hạn", confidence: 0.89, nodeId: "n3", nodeLabel: "Giải thích phí" },
      { time: "09:00:14", speaker: "Bot", content: "Áp dụng phí chậm thanh toán 2% theo chính sách.", nodeId: "n3", nodeLabel: "Giải thích phí" },
    ],
    "api-log": [
      { time: "09:00:08", speaker: "API", content: "GET /debt/kh_221 -> 200 (36ms)", nodeId: "n2", nodeLabel: "Tra dư nợ" },
      { time: "09:00:10", speaker: "API", content: "POST /intent/log -> 201 (12ms)", nodeId: "n4", nodeLabel: "Điều hướng" },
    ],
  },
  WF_CrossSell_B: {
    session: [
      { time: "10:15:00", speaker: "System", content: "Khởi tạo phiên outbound cross-sell", nodeId: "n1", nodeLabel: "Giới thiệu" },
      { time: "10:15:04", speaker: "Bot", content: "Em gọi để giới thiệu ưu đãi Premium.", nodeId: "n1", nodeLabel: "Giới thiệu" },
      { time: "10:15:09", speaker: "System", content: "Đánh giá mức độ quan tâm", nodeId: "n3", nodeLabel: "Chuyển nhánh" },
    ],
    conversation: [
      { time: "10:15:07", speaker: "Khách", content: "Gói này có lợi ích gì?", confidence: 0.92, nodeId: "n2", nodeLabel: "FAQ" },
      { time: "10:15:10", speaker: "Bot", content: "Gói Premium giúp tăng ưu đãi và hỗ trợ riêng.", nodeId: "n2", nodeLabel: "FAQ" },
    ],
    kb: [
      { time: "10:15:08", speaker: "KB", content: "KB_PREMIUM_FAQ -> 3 câu trả lời phù hợp", confidence: 0.9, nodeId: "n2", nodeLabel: "FAQ" },
    ],
    "api-log": [
      { time: "10:15:12", speaker: "API", content: "POST /lead/interest -> 202 (18ms)", nodeId: "n3", nodeLabel: "Chuyển nhánh" },
    ],
  },
  WF_ThanhToan: {
    session: [
      { time: "08:30:00", speaker: "System", content: "Bắt đầu phiên inbound hotline thanh toán", nodeId: "n1", nodeLabel: "Thu intent" },
      { time: "08:30:05", speaker: "System", content: "Kiểm tra trạng thái giao dịch", nodeId: "n2", nodeLabel: "Tra trạng thái" },
    ],
    conversation: [
      { time: "08:30:03", speaker: "Khách", content: "Tôi bị lỗi thanh toán.", confidence: 0.97, nodeId: "n1", nodeLabel: "Thu intent" },
      { time: "08:30:07", speaker: "Bot", content: "Em đang kiểm tra trạng thái giao dịch giúp anh/chị.", nodeId: "n2", nodeLabel: "Tra trạng thái" },
    ],
    kb: [
      { time: "08:30:08", speaker: "KB", content: "Không dùng KB ở workflow này", nodeId: "n3", nodeLabel: "Fallback" },
    ],
    "api-log": [
      { time: "08:30:06", speaker: "API", content: "GET /payment/status -> 200 (28ms)", nodeId: "n2", nodeLabel: "Tra trạng thái" },
    ],
  },
};

const callReports: CallReport[] = Array.from({ length: 18 }, (_, index) => {
  const id = `CALL-${1000 + index}`;
  return {
    id,
    customerPhone: `090${(1000000 + index).toString().slice(-7)}`,
    campaign: index % 2 === 0 ? "Nhắc lịch thanh toán tháng 2" : "Cross-sell gói Premium",
    workflow: index % 2 === 0 ? "WF_ThuNo_A" : "WF_CrossSell_B",
    intent: index % 3 === 0 ? "Xác nhận thanh toán" : "Cần tư vấn",
    durationSec: 75 + index * 3,
    status: index % 5 === 0 ? "Transferred" : index % 2 === 0 ? "Success" : "Failed",
    startAt: new Date(now - index * 3600_000).toISOString(),
    transcript: [
      { time: "09:00:00", speaker: "Bot", content: "Xin chào, em là trợ lý AI." },
      { time: "09:00:06", speaker: "Khách", content: "Tôi cần tra cứu thông tin." },
      { time: "09:00:12", speaker: "Bot", content: "Em hỗ trợ ngay cho anh/chị." },
    ],
    entities: [
      { key: "customer_id", value: `KH-${2000 + index}` },
      { key: "intent", value: index % 2 === 0 ? "payment_check" : "upsell" },
    ],
  };
});

const errorMetrics: ErrorMetric[] = [
  { id: "ERR-1", type: "STT timeout", count: 28, trend: "down" },
  { id: "ERR-2", type: "API 5xx", count: 17, trend: "up" },
  { id: "ERR-3", type: "Không match intent", count: 41, trend: "down" },
];

const agentMetrics: AgentMetric[] = [
  {
    id: "AG-1",
    agentName: "Huyen Tran",
    handledCalls: 142,
    avgHandleTime: 261,
    transferRate: 12.4,
    csat: 4.6,
  },
  {
    id: "AG-2",
    agentName: "Khanh Le",
    handledCalls: 167,
    avgHandleTime: 244,
    transferRate: 10.1,
    csat: 4.8,
  },
  {
    id: "AG-3",
    agentName: "Bao Nguyen",
    handledCalls: 119,
    avgHandleTime: 289,
    transferRate: 15.2,
    csat: 4.4,
  },
];

export function listCampaigns(params: FilterParams) {
  const filtered = applyFilter(campaigns, params, ["id", "name", "workflow", "owner"]);
  const sorted = applySort(filtered, params.sort || "createdAt:desc");
  return paginate(sorted, params.page, params.pageSize);
}

export function createCampaign(draft: CampaignDraft) {
  const campaign: Campaign = {
    id: `CMP-${1000 + campaigns.length + 1}`,
    name: draft.name,
    status: "Nháp",
    source: draft.source,
    workflow: draft.workflow,
    totalCalls: 0,
    successRate: 0,
    owner: "Bạn",
    createdAt: new Date().toISOString(),
  };
  campaigns.unshift(campaign);
  return campaign;
}

export function getCampaignById(id: string) {
  return campaigns.find((item) => item.id === id) ?? null;
}

export function listInbounds(params: FilterParams) {
  const filtered = applyFilter(inbounds, params, ["id", "name", "queue", "workflow"]);
  const sorted = applySort(filtered, params.sort || "updatedAt:desc");
  return paginate(sorted, params.page, params.pageSize);
}

export function createInbound(draft: InboundDraft) {
  const inbound: InboundConfig = {
    id: `INB-${200 + inbounds.length + 1}`,
    name: draft.name,
    queue: draft.queue,
    extension: draft.extension,
    workflow: draft.workflow,
    fallback: draft.fallback,
    handoverTo: draft.handoverTo,
    status: "Nháp",
    updatedAt: new Date().toISOString(),
  };
  inbounds.unshift(inbound);
  return inbound;
}

export function listWorkflows(params: FilterParams) {
  const filtered = applyFilter(workflows, params, ["id", "name", "kind", "version"]);
  const sorted = applySort(filtered, params.sort || "updatedAt:desc");
  return paginate(sorted, params.page, params.pageSize);
}

export function getWorkflowById(id: string) {
  return workflows.find((item) => item.id === id) ?? null;
}

export function createWorkflow(draft: WorkflowDraft) {
  const created: Workflow = {
    id: `WF_${Date.now().toString().slice(-6)}`,
    name: draft.name,
    status: draft.status,
    kind: draft.kind,
    version: "v1.0",
    updatedAt: new Date().toISOString(),
    intents: draft.intents,
    nodes: draft.nodes,
  };
  workflows.unshift(created);
  return created;
}

export function updateWorkflow(id: string, draft: WorkflowDraft) {
  const index = workflows.findIndex((item) => item.id === id);
  if (index < 0) {
    return null;
  }

  const current = workflows[index];
  const nextVersionNumber = Number.parseFloat(current.version.replace("v", "")) || 1;
  const updated: Workflow = {
    ...current,
    name: draft.name,
    kind: draft.kind,
    status: draft.status,
    intents: draft.intents,
    nodes: draft.nodes,
    updatedAt: new Date().toISOString(),
    version: `v${(nextVersionNumber + 0.1).toFixed(1)}`,
  };
  workflows[index] = updated;
  return updated;
}

export function toggleWorkflowStatus(id: string) {
  const index = workflows.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const current = workflows[index];
  workflows[index] = {
    ...current,
    status: current.status === "Active" ? "Draft" : "Active",
    updatedAt: new Date().toISOString(),
  };
  return workflows[index];
}
function buildWorkflowPreviewFromWorkflow(workflow: Workflow) {
  const session = workflow.nodes.map((node, index) => ({
    time: `09:00:${String(index * 3).padStart(2, "0")}`,
    speaker: index === 0 ? "System" : "Bot",
    content:
      index === 0
        ? `Khởi tạo workflow ${workflow.name}`
        : `Đang xử lý node ${node.label}: ${node.value}`,
    nodeId: node.id,
    nodeLabel: node.label,
  })) satisfies WorkflowPreviewItem[];

  const conversation = workflow.nodes.map((node, index) => ({
    time: `09:01:${String(index * 3).padStart(2, "0")}`,
    speaker: node.type === "API" ? "System" : "Bot",
    content:
      node.type === "Condition"
        ? `Điều hướng theo điều kiện tại ${node.label}`
        : node.value,
    confidence: node.type === "Condition" ? 0.91 : undefined,
    nodeId: node.id,
    nodeLabel: node.label,
  })) satisfies WorkflowPreviewItem[];

  const kb = workflow.nodes
    .filter((node) => node.type === "KB")
    .map((node, index) => ({
      time: `09:02:${String(index * 4).padStart(2, "0")}`,
      speaker: "KB",
      content: `Tra cứu dữ liệu cho ${node.label}: ${node.value}`,
      confidence: 0.88,
      nodeId: node.id,
      nodeLabel: node.label,
    })) satisfies WorkflowPreviewItem[];

  const apiLog = workflow.nodes
    .filter((node) => node.type === "API" || node.type === "Condition")
    .map((node, index) => ({
      time: `09:03:${String(index * 4).padStart(2, "0")}`,
      speaker: "API",
      content:
        node.type === "API"
          ? `${node.value} -> 200 (${24 + index * 7}ms)`
          : `POST /workflow/router -> 200 (${14 + index * 4}ms)`,
      nodeId: node.id,
      nodeLabel: node.label,
    })) satisfies WorkflowPreviewItem[];

  return {
    session,
    conversation,
    kb: kb.length ? kb : [{ time: "09:02:00", speaker: "KB", content: "Workflow này không dùng KB", nodeId: workflow.nodes[0]?.id, nodeLabel: workflow.nodes[0]?.label }],
    "api-log": apiLog.length
      ? apiLog
      : [{ time: "09:03:00", speaker: "API", content: "Workflow này chưa phát sinh API call", nodeId: workflow.nodes[0]?.id, nodeLabel: workflow.nodes[0]?.label }],
  } satisfies Record<string, WorkflowPreviewItem[]>;
}

export function getWorkflowPreview(id: string, tab: string, nodeId?: string) {
  const workflow = getWorkflowById(id) ?? workflows[0];
  const tabs = previewData[id] ?? buildWorkflowPreviewFromWorkflow(workflow);
  const items = tabs[tab] ?? tabs.session;
  if (!nodeId) {
    return items;
  }
  const filtered = items.filter((item) => item.nodeId === nodeId);
  return filtered.length ? filtered : items;
}

export function getReportOverview(): ReportOverview {
  return {
    totalCalls: 16420,
    successCalls: 11310,
    failedCalls: 3122,
    avgDurationSec: 202,
    conversionRate: 38.6,
  };
}

export function listInboundReports(params: FilterParams) {
  const base = callReports.filter((item) => item.workflow.includes("WF_"));
  const filtered = applyFilter(base, params, ["id", "campaign", "workflow", "customerPhone"]);
  const sorted = applySort(filtered, params.sort || "startAt:desc");
  return paginate(sorted, params.page, params.pageSize);
}

export function listOutboundReports(params: FilterParams) {
  const filtered = applyFilter(callReports, params, ["id", "campaign", "workflow", "customerPhone"]);
  const sorted = applySort(filtered, params.sort || "startAt:desc");
  return paginate(sorted, params.page, params.pageSize);
}

export function getCallReport(id: string) {
  return callReports.find((item) => item.id === id) ?? null;
}

export function listErrorMetrics() {
  return errorMetrics;
}

export function listAgentMetrics(params: FilterParams) {
  const filtered = applyFilter(agentMetrics, params, ["agentName", "id"]);
  const sorted = applySort(filtered, params.sort || "handledCalls:desc");
  return paginate(sorted, params.page, params.pageSize);
}
