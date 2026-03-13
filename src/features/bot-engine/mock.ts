export type OutboundStatus = "Đang chạy" | "Nháp" | "Tạm dừng" | "Hoàn tất";
export type InboundStatus = "Hoạt động" | "Nháp" | "Tạm dừng";

export interface KnowledgeRef {
  id: string;
  title: string;
  sourceType: "URL" | "Article" | "File";
  status: "Đã học" | "Chưa học" | "Đang học";
  updatedAt: string;
  summary: string;
}

export interface OutboundCampaignPreview {
  id: string;
  name: string;
  description: string;
  workflowId: string;
  kbId: string;
  dataSource: string;
  schedule: string;
  retryRule: string;
  totalCalls: number;
  successRate: number;
  status: OutboundStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InboundRoutePreview {
  id: string;
  name: string;
  description: string;
  workflowId: string;
  kbId: string;
  queue: string;
  extension: string;
  entryPoint: string;
  updatedAt: string;
  status: InboundStatus;
}

export interface WorkflowRef {
  id: string;
  name: string;
  kind: "Inbound" | "Outbound" | "Playground";
  version: string;
  summary: string;
}

export const knowledgeRefs: KnowledgeRef[] = [
  {
    id: "KB-100",
    title: "Quy trình thanh toán trễ hạn",
    sourceType: "URL",
    status: "Đã học",
    updatedAt: "2025-09-10T08:00:00Z",
    summary: "Hướng dẫn xử lý KH trễ hạn, lộ trình nhắc nợ và chính sách gia hạn.",
  },
  {
    id: "KB-101",
    title: "FAQ gói Premium",
    sourceType: "Article",
    status: "Đã học",
    updatedAt: "2025-09-12T10:30:00Z",
    summary: "Câu hỏi thường gặp về quyền lợi, giá, nâng/hạ gói Premium.",
  },
  {
    id: "KB-102",
    title: "Kịch bản chào mừng khách mới",
    sourceType: "File",
    status: "Chưa học",
    updatedAt: "2025-09-14T14:00:00Z",
    summary: "Script chào mừng, giới thiệu sản phẩm và hướng dẫn đăng ký tài khoản.",
  },
];

export const workflowRefs: WorkflowRef[] = [
  {
    id: "WF_FullNode_Demo",
    name: "Demo đầy đủ node và entity",
    kind: "Outbound",
    version: "v1.0",
    summary: "Workflow demo có đủ Start, Prompt, Intent, Condition, API, KB, Handover và End để review semantics.",
  },
  {
    id: "WF_ThuNo_A",
    name: "Thu nợ chuẩn A",
    kind: "Outbound",
    version: "v2.3",
    summary: "Workflow nhắc nợ và tra dư nợ cơ bản cho outbound debt collection.",
  },
  {
    id: "WF_CrossSell_B",
    name: "Cross-sell Premium",
    kind: "Outbound",
    version: "v1.8",
    summary: "Workflow outbound giới thiệu gói Premium và xử lý FAQ bán hàng.",
  },
  {
    id: "WF_Mau_HoanChinh",
    name: "Mẫu hoàn chỉnh Outbound CSKH",
    kind: "Outbound",
    version: "v1.0",
    summary: "Workflow outbound mẫu có đủ nhánh API, KB, handover và end-to-end review flow.",
  },
  {
    id: "WF_ThanhToan",
    name: "Inbound hỗ trợ thanh toán",
    kind: "Inbound",
    version: "v3.0",
    summary: "Workflow inbound tiếp nhận nhu cầu hỗ trợ thanh toán và chuyển agent khi cần.",
  },
];

export function getWorkflowRef(id: string) {
  return workflowRefs.find((item) => item.id === id) ?? null;
}

export function getKnowledgeRef(id: string) {
  return knowledgeRefs.find((item) => item.id === id) ?? null;
}

export const outboundCampaignsMock: OutboundCampaignPreview[] = [
  {
    id: "CMP-1001",
    name: "Thu hồi công nợ Q3",
    description: "Chiến dịch nhắc nợ quý 3, tập trung KH trễ hạn >30 ngày.",
    workflowId: "WF_ThuNo_A",
    kbId: "KB-100",
    dataSource: "CRM khách hàng quá hạn",
    schedule: "09:00 - 19:00",
    retryRule: "Retry 2 lần, mỗi 15 phút",
    totalCalls: 12540,
    successRate: 0.72,
    status: "Đang chạy",
    createdAt: "2025-09-01T07:00:00Z",
    updatedAt: "2025-09-15T16:00:00Z",
  },
  {
    id: "CMP-1002",
    name: "Nhắc lịch thanh toán tháng 9",
    description: "Nhắc KH thanh toán trước hạn 3 ngày.",
    workflowId: "WF_Mau_HoanChinh",
    kbId: "KB-101",
    dataSource: "Segment: sắp đến hạn",
    schedule: "08:30 - 18:00",
    retryRule: "Retry 1 lần sau 30 phút",
    totalCalls: 8300,
    successRate: 0.85,
    status: "Hoàn tất",
    createdAt: "2025-08-28T09:00:00Z",
    updatedAt: "2025-09-12T18:30:00Z",
  },
  {
    id: "CMP-1003",
    name: "Chào mừng khách mới tháng 9",
    description: "Gọi chào mừng và giới thiệu sản phẩm cho KH đăng ký mới.",
    workflowId: "WF_Mau_HoanChinh",
    kbId: "KB-102",
    dataSource: "File upload: new_customers_sep.csv",
    schedule: "10:00 - 17:00",
    retryRule: "Không retry",
    totalCalls: 3200,
    successRate: 0.61,
    status: "Nháp",
    createdAt: "2025-09-10T10:00:00Z",
    updatedAt: "2025-09-14T11:00:00Z",
  },
  {
    id: "CMP-1004",
    name: "Survey NPS Q3",
    description: "Khảo sát mức độ hài lòng khách hàng quý 3.",
    workflowId: "WF_CrossSell_B",
    kbId: "KB-101",
    dataSource: "CRM toàn bộ KH active",
    schedule: "09:00 - 20:00",
    retryRule: "Retry 3 lần, mỗi 10 phút",
    totalCalls: 5100,
    successRate: 0.45,
    status: "Tạm dừng",
    createdAt: "2025-09-05T08:00:00Z",
    updatedAt: "2025-09-13T09:00:00Z",
  },
];

export const inboundRoutesMock: InboundRoutePreview[] = [
  {
    id: "INB-2001",
    name: "Hotline CSKH",
    description: "Tuyến inbound chính cho tổng đài CSKH.",
    workflowId: "WF_ThanhToan",
    kbId: "KB-100",
    queue: "Queue Payment",
    extension: "801",
    entryPoint: "19001234",
    updatedAt: "2025-09-15T10:00:00Z",
    status: "Hoạt động",
  },
  {
    id: "INB-2002",
    name: "Inbound Sales",
    description: "Tuyến inbound cho đội sales tiếp nhận lead.",
    workflowId: "WF_ThanhToan",
    kbId: "KB-101",
    queue: "Queue Sales",
    extension: "812",
    entryPoint: "19005678",
    updatedAt: "2025-09-14T14:00:00Z",
    status: "Hoạt động",
  },
  {
    id: "INB-2003",
    name: "Support Premium",
    description: "Tuyến hỗ trợ riêng cho KH gói Premium.",
    workflowId: "WF_ThanhToan",
    kbId: "KB-102",
    queue: "Queue VIP",
    extension: "820",
    entryPoint: "19009999",
    updatedAt: "2025-09-12T08:30:00Z",
    status: "Nháp",
  },
];
