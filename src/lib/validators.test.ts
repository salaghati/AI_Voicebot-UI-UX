import {
  campaignStep1Schema,
  campaignStep2Schema,
  campaignStep3Schema,
  inboundStep1Schema,
  loginSchema,
} from "@/lib/validators";

describe("validators", () => {
  it("validates login payload", () => {
    expect(() => loginSchema.parse({ email: "admin@voicebot.vn", password: "123456" })).not.toThrow();
    expect(() => loginSchema.parse({ email: "invalid", password: "123456" })).toThrow();
  });

  it("validates campaign wizard steps", () => {
    expect(() => campaignStep1Schema.parse({ name: "Campaign A", source: "CRM" })).not.toThrow();
    expect(() => campaignStep2Schema.parse({ workflow: "WF_ThuNo_A" })).not.toThrow();
    expect(() =>
      campaignStep3Schema.parse({ schedule: "09:00-12:00", callerId: "19001234", retryRule: "2 lần" }),
    ).not.toThrow();
  });

  it("validates inbound wizard step 1", () => {
    expect(() =>
      inboundStep1Schema.parse({ name: "Inbound CS", queue: "queue_payment", extension: "801" }),
    ).not.toThrow();
  });
});
