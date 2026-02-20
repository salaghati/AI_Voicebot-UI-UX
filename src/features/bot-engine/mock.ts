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
  { id: "WF-3001", name: "Thu hồi công nợ", kind: "Outbound" },
  { id: "WF-3002", name: "Nhắc lịch thanh toán", kind: "Outbound" },
  { id: "WF-3003", name: "CSKH Inbound", kind: "Inbound" },
  { id: "WF-3004", name: "Chào mừng khách mới", kind: "Outbound" },
  { id: "WF-3005", name: "Survey NPS", kind: "Outbound" },
  { id: "WF-3006", name: "Inbound Sales", kind: "Inbound" },
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
    workflowId: "WF-3001",
    kbId: "KB-100",
    dataSource: "CRM khách hàng quá hạn",
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
    workflowId: "WF-3002",
    kbId: "KB-101",
    dataSource: "Segment: sắp đến hạn",
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
    workflowId: "WF-3004",
    kbId: "KB-102",
    dataSource: "File upload: new_customers_sep.csv",
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
    workflowId: "WF-3005",
    kbId: "KB-101",
    dataSource: "CRM toàn bộ KH active",
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
    workflowId: "WF-3003",
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
    workflowId: "WF-3006",
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
    workflowId: "WF-3003",
    kbId: "KB-102",
    queue: "Queue VIP",
    extension: "820",
    entryPoint: "19009999",
    updatedAt: "2025-09-12T08:30:00Z",
    status: "Nháp",
  },
];
