import type {
  AgentGroup,
  AgentSettings,
  ApiEndpointSetting,
  ApiSettings,
  FallbackRule,
  HandoverProfile,
  KbDocument,
  KbFallbackRule,
  KbSourceType,
  RolePermission,
} from "@/types/domain";

export const kbDocs: KbDocument[] = [
  {
    id: "KB-100",
    title: "Landing Page Thu hồi nợ",
    source: "URL Source",
    sourceType: "url",
    status: "Đã học",
    version: "v3",
    updatedAt: new Date().toISOString(),
    url: "https://example.com/thu-hoi-no",
    displayName: "Landing Page Thu hồi nợ",
    crawlMode: "Entire Site",
    pageLimit: 100,
    patterns: "/billing,/payment,/faq",
  },
  {
    id: "KB-101",
    title: "Kịch bản chào mừng khách mới",
    source: "File Source",
    sourceType: "file",
    status: "Chưa học",
    version: "v1",
    updatedAt: new Date(Date.now() - 86400_000 * 3).toISOString(),
    fileName: "welcome-script.pdf",
    displayName: "Kịch bản chào mừng khách mới",
    fileTypes: "PDF",
    chunkingMode: "Auto (Recommended)",
  },
  {
    id: "KB-102",
    title: "FAQ gói Premium",
    source: "Article Source",
    sourceType: "article",
    status: "Chưa học",
    version: "v2",
    updatedAt: new Date(Date.now() - 86_400_000 * 7).toISOString(),
    articleTitle: "FAQ gói Premium",
    articleContent:
      "Khách hàng được nâng hạng sau 30 ngày sử dụng. Nếu cần đối soát cước, chuyển sang intent tra_cuoc hoặc nhân viên hỗ trợ.",
    articleTags: ["premium", "faq", "cskh"],
  },
  {
    id: "KB-103",
    title: "Điều khoản chiến dịch Q4",
    source: "Article Source",
    sourceType: "article",
    status: "Đã học",
    version: "v5",
    updatedAt: new Date(Date.now() - 86_400_000 * 14).toISOString(),
    articleTitle: "Điều khoản chiến dịch Q4",
    articleContent:
      "Tài liệu tổng hợp điều kiện áp dụng ưu đãi quý 4, hướng dẫn bot giải đáp về thời gian hiệu lực và phạm vi khách hàng áp dụng.",
    articleTags: ["q4", "promo", "policy"],
  },
];

function getKbSourceLabel(sourceType: KbSourceType) {
  return {
    url: "URL Source",
    article: "Article Source",
    file: "File Source",
  }[sourceType];
}

function buildKbTitle(payload: Partial<KbDocument>) {
  if (payload.sourceType === "article") {
    return String(payload.articleTitle || payload.title || "Bài viết mới");
  }
  return String(payload.displayName || payload.title || payload.fileName || payload.url || "KB mới");
}

export function listKbDocs() {
  return kbDocs;
}

export function getKbDocById(id: string) {
  return kbDocs.find((item) => item.id === id) ?? null;
}

export function createMockKbDoc(payload: Partial<KbDocument> & { articleTags?: string[] | string }) {
  const sourceType = (payload.sourceType as KbSourceType) || "url";
  const next: KbDocument = {
    id: `KB-${100 + kbDocs.length}`,
    title: buildKbTitle({ ...payload, sourceType }),
    source: getKbSourceLabel(sourceType),
    sourceType,
    status: "Chưa học",
    version: "v1",
    updatedAt: new Date().toISOString(),
    url: payload.url ? String(payload.url) : undefined,
    displayName: payload.displayName ? String(payload.displayName) : undefined,
    crawlMode: payload.crawlMode === "Entire Site" ? "Entire Site" : "Single Page",
    pageLimit: payload.pageLimit ? Number(payload.pageLimit) : 100,
    patterns: payload.patterns ? String(payload.patterns) : undefined,
    articleTitle: payload.articleTitle ? String(payload.articleTitle) : undefined,
    articleContent: payload.articleContent ? String(payload.articleContent) : undefined,
    articleTags: Array.isArray(payload.articleTags)
      ? payload.articleTags.map((tag) => String(tag))
      : typeof payload.articleTags === "string"
        ? String(payload.articleTags)
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : undefined,
    fileName: payload.fileName ? String(payload.fileName) : undefined,
    fileTypes: payload.fileTypes ? String(payload.fileTypes) : sourceType === "file" ? "PDF" : undefined,
    chunkingMode:
      payload.chunkingMode === "Small chunk" || payload.chunkingMode === "Large chunk"
        ? payload.chunkingMode
        : sourceType === "file"
          ? "Auto (Recommended)"
          : undefined,
  };

  kbDocs.unshift(next);
  return next;
}

export function updateMockKbDoc(id: string, payload: Partial<KbDocument> & { articleTags?: string[] | string }) {
  const index = kbDocs.findIndex((item) => item.id === id);
  if (index < 0) {
    return null;
  }

  const current = kbDocs[index];
  const sourceType = (payload.sourceType as KbSourceType) || current.sourceType;
  const next: KbDocument = {
    ...current,
    ...payload,
    id,
    sourceType,
    source: getKbSourceLabel(sourceType),
    title: buildKbTitle({ ...current, ...payload, sourceType }),
    updatedAt: new Date().toISOString(),
  };

  if (typeof payload.articleTags === "string") {
    next.articleTags = payload.articleTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  kbDocs[index] = next;
  return next;
}

export function deleteMockKbDoc(id: string) {
  const index = kbDocs.findIndex((item) => item.id === id);
  if (index < 0) {
    return false;
  }
  kbDocs.splice(index, 1);
  return true;
}

export const kbUsage = [
  { id: "USG-1", kbId: "KB-100", workflow: "WF_ThuNo_A", calls: 342, topIntent: "Xác nhận thanh toán" },
  { id: "USG-2", kbId: "KB-101", workflow: "WF_CrossSell_B", calls: 211, topIntent: "Quan tâm" },
];

export const sttTtsSetting = {
  sttProvider: "Deepgram",
  ttsProvider: "ElevenLabs",
  vad: true,
  voice: "Linh Nữ miền Nam",
};

const apiEndpoints: ApiEndpointSetting[] = [
  {
    id: "api_tra_cuoc",
    name: "tra_cuoc_api",
    method: "GET",
    url: "/billing/current",
    authType: "Bearer Token",
    authProfile: "billing_service_token",
    timeoutMs: 3000,
    status: "connected",
    requestTemplate: '{ "customer_id": "{{customer_id}}" }',
    responseTemplate: '{ "amount_due": "{{amount_due}}", "due_date": "{{due_date}}" }',
  },
  {
    id: "api_book_call",
    name: "book_call_api",
    method: "POST",
    url: "/callbacks/book",
    authType: "API Key",
    authProfile: "callback_scheduler_key",
    timeoutMs: 5000,
    status: "connected",
    requestTemplate: '{ "phone": "{{phone_number}}", "slot": "{{appointment_slot}}" }',
    responseTemplate: '{ "booking_id": "{{booking_id}}" }',
  },
  {
    id: "api_order_status",
    name: "order_status_api",
    method: "GET",
    url: "/orders/status",
    authType: "Bearer Token",
    authProfile: "oms_service_token",
    timeoutMs: 3000,
    status: "disconnected",
    requestTemplate: '{ "order_id": "{{order_id}}" }',
    responseTemplate: '{ "order_status": "{{order_status}}" }',
  },
];

export const apiSetting: ApiSettings = {
  baseUrl: "https://api.mock.voicebot.vn/v1",
  timeoutMs: 4500,
  retry: 2,
  endpoints: apiEndpoints,
};

const agentGroups: AgentGroup[] = [
  {
    id: "grp_support_l1",
    name: "Support_L1",
    description: "Nhóm xử lý CSKH và hỗ trợ thanh toán cơ bản",
    priority: "Cao",
    maxWaitSec: 60,
    callbackAllowed: true,
    active: true,
    agents: 15,
  },
  {
    id: "grp_support_l2",
    name: "Support_L2",
    description: "Nhóm xử lý case khó hoặc escalation cấp 2",
    priority: "Trung bình",
    maxWaitSec: 90,
    callbackAllowed: true,
    active: true,
    agents: 8,
  },
  {
    id: "grp_vip_support",
    name: "VIP_Support",
    description: "Nhóm chăm sóc khách hàng VIP",
    priority: "Đặc biệt",
    maxWaitSec: 45,
    callbackAllowed: true,
    active: true,
    agents: 5,
  },
];

const handoverProfiles: HandoverProfile[] = [
  {
    id: "hp_collection_default",
    name: "Collection Default",
    targetType: "agent_group",
    targetRefId: "grp_support_l1",
    contextTemplateId: "ctx_standard",
    failAction: "retry_transfer",
    active: true,
    description: "Profile mặc định cho nhắc thanh toán và kiểm tra dư nợ.",
  },
  {
    id: "hp_complaint_priority",
    name: "Complaint Priority",
    targetType: "agent_group",
    targetRefId: "grp_support_l2",
    contextTemplateId: "ctx_full_transcript",
    failAction: "fallback_node",
    active: true,
    description: "Ưu tiên cho case khiếu nại hoặc escalation.",
  },
  {
    id: "hp_vip_fast_lane",
    name: "VIP Fast Lane",
    targetType: "agent_group",
    targetRefId: "grp_vip_support",
    contextTemplateId: "ctx_vip",
    failAction: "callback",
    active: true,
    description: "Luồng chuyển nhanh cho khách VIP hoặc khách yêu cầu gặp người thật ngay.",
  },
];

export const agentSetting: AgentSettings = {
  transferCondition: "Khách yêu cầu gặp người thật",
  transferContext: ["Transcript 10 câu gần nhất", "Intent cuối", "Entity quan trọng"],
  queue: "Support_L1",
  groups: agentGroups,
  handoverProfiles,
  globalPolicy: {
    escapeIntents: ["handover_request", "complaint"],
    escapeKeywords: ["gặp người", "nhân viên", "tổng đài viên"],
    repeatThreshold: 3,
  },
};

export const fallbackRules: FallbackRule[] = [
  { id: "FB-1", name: "STT timeout", action: "Xin phép nhắc lại", waitSec: 2 },
  { id: "FB-2", name: "API lỗi", action: "Chuyển tổng đài viên", waitSec: 0 },
];

export const kbFallbackRules: KbFallbackRule[] = [
  {
    id: "FBK-29481",
    name: "Default Unknown Intent",
    category: "NLU_NO_MATCH",
    status: "Chưa học",
    active: true,
    responseText: "Xin lỗi, tôi chưa hiểu rõ yêu cầu của anh/chị. Anh/chị có thể nói lại theo cách khác được không ạ?",
    ttsText: "Xin lỗi, tôi chưa hiểu rõ yêu cầu của anh chị. Anh chị có thể nói lại theo cách khác được không ạ?",
    nextAction: "TRANSFER_AGENT",
    targetMode: "OVERRIDE",
    targetQueue: "Queue: Level 1 Support",
    maxWaitSec: 60,
    onFailAction: "PLAY_ERROR_MESSAGE",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "FBK-29482",
    name: "KB Match Low Confidence",
    category: "SUPPORT_REQUEST",
    status: "Đã học",
    active: true,
    responseText: "Tôi chưa tìm được câu trả lời phù hợp trong kho tri thức. Tôi sẽ chuyển anh/chị sang bộ phận hỗ trợ.",
    ttsText: "Tôi chưa tìm được câu trả lời phù hợp trong kho tri thức. Tôi sẽ chuyển anh chị sang bộ phận hỗ trợ.",
    nextAction: "TRANSFER_AGENT",
    targetMode: "PRESET",
    targetQueue: "Queue: Technical Support",
    maxWaitSec: 120,
    onFailAction: "RETRY_TRANSFER",
    updatedAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: "FBK-29483",
    name: "Fallback Greeting",
    category: "GREETING",
    status: "Đang học",
    active: false,
    responseText: "Xin chào, tôi là trợ lý AI. Anh/chị cần hỗ trợ nội dung gì ạ?",
    ttsText: "Xin chào, tôi là trợ lý AI. Anh chị cần hỗ trợ nội dung gì ạ?",
    nextAction: "ASK_AGAIN",
    targetMode: "PRESET",
    targetQueue: "Queue: Sales Department",
    maxWaitSec: 30,
    onFailAction: "GO_TO_MAIN_MENU",
    updatedAt: new Date(Date.now() - 172_800_000).toISOString(),
  },
];

export function listKbFallbackRules() {
  return kbFallbackRules;
}

export function getKbFallbackRuleById(id: string) {
  return kbFallbackRules.find((item) => item.id === id) ?? null;
}

export function createKbFallbackRule(payload: Partial<KbFallbackRule>) {
  const next: KbFallbackRule = {
    id: `FBK-${29480 + kbFallbackRules.length + 1}`,
    name: String(payload.name || "Fallback mới"),
    category: (payload.category as KbFallbackRule["category"]) || "NLU_NO_MATCH",
    status: (payload.status as KbFallbackRule["status"]) || "Chưa học",
    active: Boolean(payload.active),
    responseText: String(payload.responseText || ""),
    ttsText: String(payload.ttsText || ""),
    nextAction: (payload.nextAction as KbFallbackRule["nextAction"]) || "ASK_AGAIN",
    targetMode: (payload.targetMode as KbFallbackRule["targetMode"]) || "PRESET",
    targetQueue: String(payload.targetQueue || "Queue: Level 1 Support"),
    maxWaitSec: Number(payload.maxWaitSec || 30),
    onFailAction: (payload.onFailAction as KbFallbackRule["onFailAction"]) || "PLAY_ERROR_MESSAGE",
    updatedAt: new Date().toISOString(),
  };
  kbFallbackRules.unshift(next);
  return next;
}

export function updateKbFallbackRule(id: string, payload: Partial<KbFallbackRule>) {
  const index = kbFallbackRules.findIndex((item) => item.id === id);
  if (index < 0) {
    return null;
  }

  kbFallbackRules[index] = {
    ...kbFallbackRules[index],
    ...payload,
    id,
    updatedAt: new Date().toISOString(),
  };
  return kbFallbackRules[index];
}

export function deleteKbFallbackRule(id: string) {
  const index = kbFallbackRules.findIndex((item) => item.id === id);
  if (index < 0) {
    return false;
  }
  kbFallbackRules.splice(index, 1);
  return true;
}

export function toggleKbFallbackActive(id: string) {
  const index = kbFallbackRules.findIndex((item) => item.id === id);
  if (index < 0) return null;
  kbFallbackRules[index] = {
    ...kbFallbackRules[index],
    active: !kbFallbackRules[index].active,
    updatedAt: new Date().toISOString(),
  };
  return kbFallbackRules[index];
}
export const users = [
  { id: "U-1", name: "Admin Demo", email: "admin@voicebot.vn", role: "Admin" },
  { id: "U-2", name: "Ops Demo", email: "ops@voicebot.vn", role: "Operator" },
];

export const roles: RolePermission[] = [
  { id: "R-1", roleName: "Admin", permissions: ["*"] },
  {
    id: "R-2",
    roleName: "Operator",
    permissions: [
      "bot_engine.outbound.view",
      "bot_engine.inbound.view",
      "bot_engine.call_logs.view",
      "workflow.list.view",
      "workflow.preview.view",
      "report.overview.view",
      "report.inbound.view",
      "report.outbound.view",
      "preview.playground.view",
      "kb.list.view",
    ],
  },
  {
    id: "R-3",
    roleName: "Knowledge Supervisor",
    permissions: [
      "kb.list.view",
      "kb.list.edit",
      "kb.list.delete",
      "kb.list.import",
      "kb.list.export",
      "kb.fallback.view",
      "kb.fallback.edit",
      "kb.fallback.delete",
      "kb.usage.view",
      "report.overview.view",
      "report.agent.view",
    ],
  },
];

export const phoneContexts = [
  { id: "ctx-1", name: "from-dohuudien2" },
  { id: "ctx-2", name: "from-outbound-main" },
  { id: "ctx-3", name: "from-inbound-cskh" },
];

export const phoneNumbers = [
  { id: "PN-1", number: "0592042673", context: "from-dohuudien2" },
  { id: "PN-2", number: "0592042753", context: "from-dohuudien2" },
  { id: "PN-3", number: "0592042918", context: "from-dohuudien2" },
  { id: "PN-4", number: "0592042953", context: "from-dohuudien2" },
  { id: "PN-5", number: "0592043065", context: "from-dohuudien2" },
  { id: "PN-6", number: "0281234567", context: "from-outbound-main" },
  { id: "PN-7", number: "0289876543", context: "from-outbound-main" },
  { id: "PN-8", number: "19001234", context: "from-inbound-cskh" },
  { id: "PN-9", number: "19005678", context: "from-inbound-cskh" },
];

export const extensions = [
  { id: "EXT-1", extension: "8600", outboundCid: "", password: "aB3kLm9xWq2Z" },
  { id: "EXT-2", extension: "8601", outboundCid: "", password: "Tz7nRfPq4YeX" },
  { id: "EXT-3", extension: "8602", outboundCid: "", password: "Gd5hVs8mCw1J" },
  { id: "EXT-4", extension: "8603", outboundCid: "", password: "Uk2bNj6tLa9R" },
  { id: "EXT-5", extension: "8604", outboundCid: "", password: "Xp4wQe7iYo3F" },
  { id: "EXT-6", extension: "8605", outboundCid: "", password: "Hc8zMn1vDs5K" },
  { id: "EXT-7", extension: "8606", outboundCid: "", password: "Bl6jTr3gWx9A" },
];
