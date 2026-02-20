import { mapCampaignToSummary, mapStatusTone } from "@/lib/mappers";

describe("mappers", () => {
  it("maps campaign to summary card", () => {
    const result = mapCampaignToSummary({
      id: "CMP-1",
      name: "A",
      status: "Đang chạy",
      source: "CRM",
      workflow: "WF_1",
      totalCalls: 10,
      successRate: 55,
      owner: "Owner",
      createdAt: new Date().toISOString(),
    });

    expect(result).toEqual({
      id: "CMP-1",
      title: "A",
      subtitle: "WF_1 • CRM",
      metric: "10 cuộc gọi",
    });
  });

  it("maps status to badge tone", () => {
    expect(mapStatusTone("Đang chạy")).toBe("success");
    expect(mapStatusTone("Failed")).toBe("danger");
    expect(mapStatusTone("Nháp")).toBe("warning");
  });
});
