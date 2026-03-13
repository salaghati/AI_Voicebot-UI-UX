import type { WorkflowNodeType } from "@/types/domain";

export const workflowNodeTypeMeta: Record<
  WorkflowNodeType,
  {
    label: string;
    contentLabel: string;
    description: string;
  }
> = {
  Start: {
    label: "Start",
    contentLabel: "Mô tả điểm vào",
    description: "Điểm bắt đầu của workflow. Node này chỉ đánh dấu entry point, không dùng để phân loại intent.",
  },
  Prompt: {
    label: "Prompt",
    contentLabel: "Lời bot nói",
    description: "Node phát lời thoại tĩnh hoặc thông báo ngắn trước khi sang bước tiếp theo.",
  },
  Intent: {
    label: "Intent Capture",
    contentLabel: "Câu hỏi và mục tiêu nhận diện",
    description: "Node dùng để hỏi khách, xác định khách đang muốn gì và trích ra dữ liệu cụ thể như mã khách hàng hay mã hóa đơn.",
  },
  Condition: {
    label: "Condition",
    contentLabel: "Logic điều hướng",
    description: "Node này không thu dữ liệu mới. Nó chỉ đọc intent, entity, context hoặc kết quả API đã có để quyết định đi nhánh nào.",
  },
  API: {
    label: "API Call",
    contentLabel: "Mục đích gọi API",
    description: "Node gọi hệ thống ngoài bằng các entity đã thu ở node trước để lấy dữ liệu nghiệp vụ như dư nợ, trạng thái giao dịch hoặc CRM.",
  },
  KB: {
    label: "KB Lookup",
    contentLabel: "Mục đích tra cứu KB",
    description: "Node tra tri thức từ KB đã bind ở bot. Nó thường dùng câu hỏi hoặc intent hiện tại để tìm câu trả lời, không nhất thiết phải cần entity cứng.",
  },
  Handover: {
    label: "Handover",
    contentLabel: "Thông báo chuyển agent",
    description: "Node chuyển cuộc gọi sang agent hoặc queue khi bot không nên xử lý tiếp.",
  },
  End: {
    label: "End",
    contentLabel: "Thông điệp kết thúc",
    description: "Node kết thúc luồng hội thoại và đóng cuộc gọi.",
  },
};

export function getWorkflowNodeTypeLabel(type: WorkflowNodeType) {
  return workflowNodeTypeMeta[type].label;
}

export function getWorkflowNodeContentLabel(type: WorkflowNodeType) {
  return workflowNodeTypeMeta[type].contentLabel;
}

export function getWorkflowNodeDescription(type: WorkflowNodeType) {
  return workflowNodeTypeMeta[type].description;
}
