import type { KbFallbackRule } from "@/types/domain";

export const kbFallbackCategoryOptions: Array<{ value: KbFallbackRule["category"]; label: string }> = [
  { value: "NLU_NO_MATCH", label: "Không hiểu (NLU_NO_MATCH)" },
  { value: "SUPPORT_REQUEST", label: "Yêu cầu hỗ trợ (SUPPORT_REQUEST)" },
  { value: "GREETING", label: "Lời chào (GREETING)" },
  { value: "END_CONVERSATION", label: "Kết thúc (END_CONVERSATION)" },
];

export const kbFallbackNextActions: Array<{ value: KbFallbackRule["nextAction"]; label: string }> = [
  { value: "ASK_AGAIN", label: "Hỏi lại" },
  { value: "END_CALL", label: "Kết thúc" },
  { value: "CALLBACK", label: "Tạo callback" },
  { value: "TRANSFER_AGENT", label: "Chuyển agent" },
];

export const kbFallbackQueueOptions = [
  "Queue: Level 1 Support",
  "Queue: Sales Department",
  "Queue: Technical Support",
  "Queue: VIP Customers",
];

export const kbFallbackFailActions: Array<{ value: KbFallbackRule["onFailAction"]; label: string }> = [
  { value: "PLAY_ERROR_MESSAGE", label: "Play Error Message" },
  { value: "RETRY_TRANSFER", label: "Retry Transfer" },
  { value: "END_CALL", label: "End Call" },
  { value: "GO_TO_MAIN_MENU", label: "Go to Main Menu" },
];

export function labelKbFallbackCategory(value: KbFallbackRule["category"]) {
  return kbFallbackCategoryOptions.find((item) => item.value === value)?.label ?? value;
}

export function labelKbFallbackNextAction(value: KbFallbackRule["nextAction"]) {
  return kbFallbackNextActions.find((item) => item.value === value)?.label ?? value;
}

export function labelKbFallbackFailAction(value: KbFallbackRule["onFailAction"]) {
  return kbFallbackFailActions.find((item) => item.value === value)?.label ?? value;
}
