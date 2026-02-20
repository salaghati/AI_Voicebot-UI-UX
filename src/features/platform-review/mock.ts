export type OutboundStatus = "Đang chạy" | "Nháp" | "Tạm dừng" | "Hoàn tất";
export type InboundStatus = "Hoạt động" | "Nháp" | "Tạm dừng";

export interface WorkflowRef {
  id: string;
  name: string;
  kind: "Inbound" | "Outbound" | "Playground";
  version: string;
  updatedAt: string;
  summary: string;
}

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
  createdAt: string;
  updatedAt: string;
  status: OutboundStatus;
  retryRule: string;
  schedule: string;
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

export const workflowRefs: WorkflowRef[] = [
  {
    id: "WF_ThuNo_A",
    name: "Thu nợ chuẩn A",
    kind: "Outbound",
    version: "v2.3",
    updatedAt: "2026-03-01T09:20:00.000Z",
    summary: "Luồng nhắc nợ tự động, xử lý intent xác nhận/gia hạn/từ chối và gọi API dư nợ.",
  },
  {
    id: "WF_CrossSell_B",
    name: "Cross-sell Premium",
    kind: "Outbound",
    version: "v1.8",
    updatedAt: "2026-02-25T11:15:00.000Z",
    summary: "Luồng bán chéo gói premium, có branch theo mức độ quan tâm.",
  },
  {
    id: "WF_ThanhToan",
    name: "Inbound hỗ trợ thanh toán",
    kind: "Inbound",
    version: "v3.0",
    updatedAt: "2026-03-03T08:30:00.000Z",
    summary: "Luồng inbound tra cứu giao dịch, fallback và chuyển agent khi cần.",
  },
];

export const knowledgeRefs: KnowledgeRef[] = [
  {
    id: "KB-100",
    title: "Quy trình thanh toán trễ hạn",
    sourceType: "URL",
    status: "Đã học",
    updatedAt: "2026-03-02T10:15:00.000Z",
    summary: "Tập tri thức chính sách thanh toán, phí trễ hạn và hướng dẫn đối soát.",
  },
  {
    id: "KB-101",
    title: "FAQ gói Premium",
    sourceType: "Article",
    status: "Đã học",
    updatedAt: "2026-02-27T15:10:00.000Z",
    summary: "FAQ bán hàng cho sản phẩm premium và các chương trình ưu đãi hiện hành.",
  },
  {
    id: "KB-102",
    title: "Kịch bản chào mừng khách mới",
    sourceType: "File",
    status: "Chưa học",
    updatedAt: "2026-02-20T09:00:00.000Z",
    summary: "Tài liệu script onboarding cho khách hàng mới qua tổng đài AI.",
  },
];

export const outboundCampaignsMock: OutboundCampaignPreview[] = [
  {
    id: "CMP-1001",
    name: "Nhắc lịch thanh toán tháng 2",
    description: "Danh sách khách hàng trễ hạn > 5 ngày, ưu tiên nhóm VIP.",
    workflowId: "WF_ThuNo_A",
    kbId: "KB-100",
    dataSource: "CRM khách hàng quá hạn",
    totalCalls: 1250,
    successRate: 68.4,
    createdAt: "2026-02-13T09:11:00.000Z",
    updatedAt: "2026-03-03T11:45:00.000Z",
    status: "Đang chạy",
    retryRule: "Retry tối đa 2 lần, cách 15 phút",
    schedule: "09:00 - 19:00, Thứ 2 - Thứ 7",
  },
  {
    id: "CMP-1002",
    name: "Cross-sell gói Premium",
    description: "Nhóm khách active 30 ngày gần nhất chưa dùng gói Premium.",
    workflowId: "WF_CrossSell_B",
    kbId: "KB-101",
    dataSource: "Segment người dùng active",
    totalCalls: 870,
    successRate: 43.9,
    createdAt: "2026-02-05T09:11:00.000Z",
    updatedAt: "2026-03-01T10:10:00.000Z",
    status: "Tạm dừng",
    retryRule: "Retry 1 lần nếu không bắt máy",
    schedule: "10:00 - 17:30, Thứ 2 - Thứ 6",
  },
  {
    id: "CMP-1003",
    name: "Khảo sát hài lòng sau hỗ trợ",
    description: "Khảo sát CSAT sau khi ticket được đóng.",
    workflowId: "WF_ThuNo_A",
    kbId: "KB-102",
    dataSource: "Ticket đã đóng",
    totalCalls: 220,
    successRate: 0,
    createdAt: "2026-03-04T08:00:00.000Z",
    updatedAt: "2026-03-04T08:00:00.000Z",
    status: "Nháp",
    retryRule: "Chưa cấu hình",
    schedule: "Chưa cấu hình",
  },
];

export const inboundRoutesMock: InboundRoutePreview[] = [
  {
    id: "INB-2001",
    name: "Hotline thanh toán",
    description: "Điểm vào chính cho hỗ trợ giao dịch và thanh toán.",
    workflowId: "WF_ThanhToan",
    kbId: "KB-100",
    queue: "Queue Payment",
    extension: "801",
    entryPoint: "19001234",
    updatedAt: "2026-03-03T10:00:00.000Z",
    status: "Hoạt động",
  },
  {
    id: "INB-2002",
    name: "Hotline tư vấn sản phẩm",
    description: "Tiếp nhận inbound tư vấn và điều hướng sang sales khi cần.",
    workflowId: "WF_CrossSell_B",
    kbId: "KB-101",
    queue: "Queue Sales",
    extension: "812",
    entryPoint: "19005678",
    updatedAt: "2026-03-02T16:15:00.000Z",
    status: "Nháp",
  },
  {
    id: "INB-2003",
    name: "Hỗ trợ onboarding",
    description: "Hướng dẫn kích hoạt dịch vụ cho khách hàng mới.",
    workflowId: "WF_ThanhToan",
    kbId: "KB-102",
    queue: "Queue Support",
    extension: "815",
    entryPoint: "18009999",
    updatedAt: "2026-02-28T08:40:00.000Z",
    status: "Tạm dừng",
  },
];

export function getWorkflowRef(id: string) {
  return workflowRefs.find((item) => item.id === id) || null;
}

export function getKnowledgeRef(id: string) {
  return knowledgeRefs.find((item) => item.id === id) || null;
}
