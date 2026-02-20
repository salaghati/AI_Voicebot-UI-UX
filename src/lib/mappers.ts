import type { Campaign, CampaignStatus } from "@/types/domain";

export function mapCampaignStatusTone(status: CampaignStatus) {
  switch (status) {
    case "Đang chạy":
      return "success" as const;
    case "Tạm dừng":
      return "warning" as const;
    case "Hoàn tất":
      return "info" as const;
    default:
      return "muted" as const;
  }
}

export function mapCampaignToSummary(campaign: Campaign) {
  return {
    id: campaign.id,
    title: campaign.name,
    subtitle: `${campaign.workflow} • ${campaign.source}`,
    metric: `${campaign.totalCalls} cuộc gọi`,
  };
}

export function mapStatusTone(status?: string) {
  if (!status) {
    return "muted" as const;
  }
  if (["Đang chạy", "Hoạt động", "Active", "Success", "Hoàn tất"].includes(status)) {
    return "success" as const;
  }
  if (["Tạm dừng", "Draft", "Nháp", "Transferred"].includes(status)) {
    return "warning" as const;
  }
  if (["Failed", "Tắt"].includes(status)) {
    return "danger" as const;
  }
  return "info" as const;
}
