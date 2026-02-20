import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard/);
});

test("kb flow: list -> add -> usage filter", async ({ page }) => {
  await page.goto("/kb/list");
  await expect(page.getByText("KB - 1. Danh sách KB")).toBeVisible();

  await page.goto("/kb/add");
  await page.getByPlaceholder("VD: Chính sách hoàn tiền").fill("KB từ e2e");
  await page.getByRole("button", { name: "Thêm KB" }).click();

  await page.goto("/kb/usage/filter");
  await page.getByPlaceholder("Filter thời gian / keyword").fill("WF_ThuNo_A");
  await expect(page.getByText("KB-100 • WF_ThuNo_A")).toBeVisible();
});

test("settings flow: stt-tts -> users -> roles editor", async ({ page }) => {
  await page.goto("/settings/stt-tts");
  await expect(page.getByText("Setting 1 - STT/TTS")).toBeVisible();
  await page.getByRole("button", { name: "Lưu" }).click();

  await page.goto("/settings/users/new");
  await page.locator("input").nth(0).fill("E2E User");
  await page.locator("input").nth(1).fill("e2e@voicebot.vn");
  await page.getByRole("button", { name: "Save" }).click();

  await page.goto("/settings/roles/editor");
  await page.getByPlaceholder("VD: Supervisor").fill("E2E Role");
  await page.getByRole("button", { name: "Lưu" }).click();
});
