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
    id: "WF_FullNode_Demo",
    name: "Demo đầy đủ node và entity",
    status: "Draft",
    kind: "Outbound",
    version: "v1.0",
    updatedAt: new Date(now - 1000 * 60 * 20).toISOString(),
    intents: ["payment_check", "late_fee_policy", "handover_request", "complaint", "other"],
    nodes: [
      {
        id: "demo_start",
        type: "Start",
        label: "1. START",
        value: "Điểm bắt đầu của workflow demo đầy đủ node.",
        x: 36,
        y: 34,
        ttsText: "",
      },
      {
        id: "demo_greeting",
        type: "Prompt",
        label: "2. LỜI CHÀO",
        value: "Bot chào khách và giới thiệu phạm vi hỗ trợ của cuộc gọi.",
        x: 36,
        y: 156,
        ttsText: "Xin chào anh chị, em là AI Voicebot hỗ trợ kiểm tra thanh toán.",
      },
      {
        id: "demo_capture_intent",
        type: "Intent",
        label: "3. THU INTENT + ENTITY",
        value: "Bot hỏi nhu cầu để nhận intent và trích entity như customer_id hoặc bill_code từ câu trả lời của khách.",
        x: 36,
        y: 278,
        ttsText: "Anh chị cần kiểm tra thanh toán, hỏi chính sách phí trễ hạn hay gặp tổng đài viên ạ? Nếu có, anh chị đọc giúp em mã khách hàng hoặc mã hóa đơn.",
        intents: ["payment_check", "late_fee_policy", "handover_request", "complaint", "other"],
        entities: ["customer_id", "bill_code"],
        mainIntent: "payment_check",
        confidenceThreshold: 0.84,
        fallbackNodeId: "demo_end",
        repromptText: "Anh/chị vui lòng nói rõ nhu cầu và đọc giúp em mã khách hàng nếu có.",
        timeoutSec: 7,
        maxRetry: 2,
      },
      {
        id: "demo_route",
        type: "Condition",
        label: "4. RẼ NHÁNH THEO INTENT",
        value: "Condition đọc intent vừa thu được rồi quyết định sang API, KB, Handover hoặc End.",
        x: 36,
        y: 400,
        intents: ["payment_check", "late_fee_policy", "handover_request", "complaint", "other"],
        conditionSource: "intent",
        conditionRulesText:
          "intent == payment_check -> demo_api\nintent == late_fee_policy -> demo_kb\nintent == handover_request -> demo_handover\nintent == complaint -> demo_handover",
        defaultTargetNodeId: "demo_end",
        onRuleError: "fallback",
      },
      {
        id: "demo_api",
        type: "API",
        label: "5A. API TRA DƯ NỢ",
        value: "API dùng entity customer_id hoặc bill_code đã thu ở node trước để tra số tiền cần thanh toán.",
        x: 298,
        y: 522,
        ttsText: "Em đang kiểm tra dư nợ và trạng thái thanh toán của anh chị.",
        entities: ["customer_id", "bill_code"],
        apiRef: "tra_cuoc_api",
        apiMethod: "GET",
        apiUrl: "/billing/current",
        authProfile: "billing_service_token",
        apiTimeoutMs: 3000,
        apiRetry: 2,
        successCondition: "status == 200",
        requestMapping: '{ \"customer_id\": \"{{customer_id}}\", \"bill_code\": \"{{bill_code}}\" }',
        responseMapping: '{ \"balance\": \"$.data.balance\", \"due_date\": \"$.data.due_date\" }',
        onFailAction: "fallback",
      },
      {
        id: "demo_kb",
        type: "KB",
        label: "5B. KB GIẢI THÍCH CHÍNH SÁCH",
        value: "KB trả lời câu hỏi chính sách phí trễ hạn dựa trên intent late_fee_policy và nội dung khách hỏi.",
        x: 298,
        y: 644,
        ttsText: "Em đang tra cứu chính sách phí trễ hạn cho anh chị.",
        retrievalMode: "hybrid",
        topK: 4,
        scoreThreshold: 0.76,
        rerank: true,
        citationEnabled: true,
        promptTemplate: "Tóm tắt chính sách ngắn gọn, dễ hiểu, không quá 2 câu.",
        noAnswerAction: "fallback_node",
      },
      {
        id: "demo_handover",
        type: "Handover",
        label: "5C. CHUYỂN AGENT",
        value: "Nếu intent là handover_request hoặc complaint thì bot chuyển cuộc gọi sang tổng đài viên.",
        x: 298,
        y: 766,
        ttsText: "Em chuyển cuộc gọi sang tổng đài viên để hỗ trợ trực tiếp cho anh chị.",
        handoverTarget: "queue_payment",
        handoverMessage: "Chuyển máy sang hàng chờ hỗ trợ thanh toán và khiếu nại.",
        onHandoverFail: "fallback_node",
      },
      {
        id: "demo_end",
        type: "End",
        label: "6. KẾT THÚC",
        value: "Bot kết thúc cuộc gọi sau khi xử lý xong hoặc khi không có nhánh phù hợp.",
        x: 84,
        y: 888,
        ttsText: "Cảm ơn anh chị đã liên hệ. Chúc anh chị một ngày tốt lành.",
        endReason: "completed",
      },
    ],
  },
  {
    id: "WF_ThuNo_A",
    name: "Thu nợ chuẩn A",
    status: "Active",
    kind: "Outbound",
    version: "v2.3",
    updatedAt: new Date(now - 86400000 * 2).toISOString(),
    intents: ["Xác nhận thanh toán", "Xin gia hạn", "Từ chối"],
    nodes: [
      { id: "n1", type: "Prompt", label: "Mở đầu", value: "Chào khách và xác thực danh tính", ttsText: "Em chào anh chị, em gọi để xác thực và nhắc lịch thanh toán." },
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
      { id: "n1", type: "Prompt", label: "Giới thiệu", value: "Mở đầu giới thiệu ưu đãi Premium", ttsText: "Em gọi để giới thiệu ưu đãi của gói Premium." },
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
      { id: "n1", type: "Intent", label: "Thu intent", value: "Anh/chị đang cần hỗ trợ phương thức thanh toán, lỗi giao dịch hay gặp agent ạ?", ttsText: "Anh chị đang cần hỗ trợ phương thức thanh toán, lỗi giao dịch hay gặp agent ạ?" },
      { id: "n2", type: "API", label: "Tra trạng thái", value: "GET /payment/status" },
      { id: "n3", type: "Handover", label: "Chuyển agent", value: "Chuyển cuộc gọi cho tổng đài viên khi khách cần hỗ trợ trực tiếp.", ttsText: "Em chuyển cuộc gọi sang tổng đài viên để hỗ trợ trực tiếp cho anh chị.", handoverTarget: "queue_payment", onHandoverFail: "end_call" },
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
        type: "Start",
        label: "START",
        value: "Điểm bắt đầu của workflow",
        x: 36,
        y: 34,
        ttsText: "",
      },
      {
        id: "node_greeting",
        type: "Prompt",
        label: "LỜI CHÀO",
        value: "Xin chào anh/chị, em là AI Voicebot hỗ trợ thanh toán.",
        x: 36,
        y: 156,
        ttsText: "Xin chào anh chị, em là AI Voicebot hỗ trợ thanh toán.",
      },
      {
        id: "node_capture_intent",
        type: "Intent",
        label: "HỎI NHU CẦU",
        value: "Anh/chị cần em hỗ trợ kiểm tra thanh toán, giải thích phí hay gặp nhân viên ạ?",
        x: 36,
        y: 278,
        ttsText: "Anh chị cần em hỗ trợ kiểm tra thanh toán, giải thích phí hay gặp nhân viên ạ?",
        intents: ["payment_check", "late_fee_policy", "handover_request", "other"],
        entities: ["customer_id"],
        mainIntent: "payment_check",
        confidenceThreshold: 0.82,
        fallbackNodeId: "node_end",
        repromptText: "Anh/chị có thể nói rõ hơn nhu cầu giúp em được không ạ?",
        timeoutSec: 7,
        maxRetry: 2,
      },
      {
        id: "node_route",
        type: "Condition",
        label: "PHÂN LUỒNG",
        value: "Điều hướng theo intent sau khi nhận nhu cầu.",
        x: 36,
        y: 400,
        intents: ["payment_check", "late_fee_policy", "handover_request", "other"],
        conditionSource: "intent",
        conditionRulesText:
          "intent == payment_check -> node_api\nintent == late_fee_policy -> node_kb\nintent == handover_request -> node_handover",
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
        id: "node_kb",
        type: "KB",
        label: "TRA CỨU CHÍNH SÁCH",
        value: "Tra tri thức về quy trình thanh toán trễ hạn và phí phát sinh.",
        x: 298,
        y: 644,
        ttsText: "Em đang tra cứu thông tin về chính sách thanh toán trễ hạn cho anh chị.",
        retrievalMode: "hybrid",
        topK: 3,
        scoreThreshold: 0.75,
        rerank: true,
        citationEnabled: true,
        promptTemplate: "Tóm tắt chính sách thanh toán trễ hạn ngắn gọn, dễ hiểu.",
        noAnswerAction: "fallback_node",
      },
      {
        id: "node_handover",
        type: "Handover",
        label: "CHUYỂN AGENT",
        value: "Chuyển cuộc gọi cho tổng đài viên khi khách yêu cầu.",
        x: 298,
        y: 766,
        ttsText: "Em chuyển cuộc gọi sang tổng đài viên để hỗ trợ trực tiếp cho anh chị.",
        handoverTarget: "queue_payment",
        handoverMessage: "Chuyển máy sang hàng chờ hỗ trợ thanh toán.",
        onHandoverFail: "fallback_node",
      },
      {
        id: "node_end",
        type: "End",
        label: "KẾT THÚC",
        value: "Cảm ơn anh/chị, chúc anh/chị một ngày tốt lành.",
        x: 84,
        y: 888,
        ttsText: "Cảm ơn anh chị, chúc anh chị một ngày tốt lành.",
        endReason: "completed",
      },
    ],
  },
];

const legacyWorkflowIdMap: Record<string, string> = {
  "WF-3001": "WF_ThuNo_A",
  "WF-3002": "WF_Mau_HoanChinh",
  "WF-3003": "WF_ThanhToan",
  "WF-3004": "WF_Mau_HoanChinh",
  "WF-3005": "WF_CrossSell_B",
  "WF-3006": "WF_ThanhToan",
};

function resolveWorkflowId(id: string) {
  return legacyWorkflowIdMap[id] ?? id;
}

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
      { time: "08:30:08", speaker: "KB", content: "Workflow này không dùng KB để trả lời runtime", nodeId: "n3", nodeLabel: "Chuyển agent" },
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
  const resolvedId = resolveWorkflowId(id);
  return workflows.find((item) => item.id === resolvedId) ?? null;
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
  const resolvedId = resolveWorkflowId(id);
  const index = workflows.findIndex((item) => item.id === resolvedId);
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
  const resolvedId = resolveWorkflowId(id);
  const index = workflows.findIndex((item) => item.id === resolvedId);
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
    speaker: node.type === "Start" ? "System" : "Bot",
    content:
      node.type === "Start"
        ? `Khởi tạo workflow ${workflow.name}`
        : node.type === "Handover"
          ? `Chuyển cuộc gọi tại node ${node.label}`
        : `Đang xử lý node ${node.label}: ${node.value}`,
    nodeId: node.id,
    nodeLabel: node.label,
  })) satisfies WorkflowPreviewItem[];

  const conversation = workflow.nodes.map((node, index) => ({
    time: `09:01:${String(index * 3).padStart(2, "0")}`,
    speaker: node.type === "API" || node.type === "Start" ? "System" : node.type === "Handover" ? "Agent Router" : "Bot",
    content:
      node.type === "Condition"
        ? `Điều hướng theo điều kiện tại ${node.label}`
        : node.type === "Handover"
          ? node.handoverMessage || node.value
        : node.type === "End"
          ? node.ttsText || node.value
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
    .filter((node) => node.type === "API" || node.type === "Condition" || node.type === "Handover")
    .map((node, index) => ({
      time: `09:03:${String(index * 4).padStart(2, "0")}`,
      speaker: "API",
      content:
        node.type === "API"
          ? `${node.value} -> 200 (${24 + index * 7}ms)`
          : node.type === "Handover"
            ? `POST /agent/handover -> 202 (${18 + index * 3}ms)`
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
