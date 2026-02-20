import { createCampaign, createInbound, listCampaigns, listInbounds } from "@/lib/mock-db";

describe("mock-db integration", () => {
  it("creates campaign and returns in listing", () => {
    const before = listCampaigns({ page: 1, pageSize: 50 }).total;
    const created = createCampaign({
      name: "Campaign Integration",
      source: "CSV",
      workflow: "WF_ThuNo_A",
      schedule: "09:00-12:00",
      callerId: "19001234",
      retryRule: "2 lần",
      note: "test",
    });

    const after = listCampaigns({ page: 1, pageSize: 50 });
    expect(after.total).toBe(before + 1);
    expect(after.items[0].id).toBe(created.id);
  });

  it("creates inbound and returns in listing", () => {
    const before = listInbounds({ page: 1, pageSize: 50 }).total;
    const created = createInbound({
      name: "Inbound Integration",
      queue: "queue_payment",
      extension: "801",
      workflow: "WF_ThanhToan",
      fallback: "Chuyển tổng đài viên",
      handoverTo: "CS Team A",
      note: "test",
    });

    const after = listInbounds({ page: 1, pageSize: 50 });
    expect(after.total).toBe(before + 1);
    expect(after.items[0].id).toBe(created.id);
  });
});
