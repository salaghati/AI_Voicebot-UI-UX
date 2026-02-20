import { test, expect } from "@playwright/test";

test("login -> dashboard -> create outbound", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/bot-engine/outbound/create");
  await expect(page.getByText("Tạo Outbound Campaign")).toBeVisible();
});

test("login failed + forgot password", async ({ page }) => {
  await page.goto("/auth/login?failed=1");
  await expect(page.getByText("Login Failed")).toBeVisible();
  await page.getByRole("link", { name: "Quên mật khẩu" }).click();
  await expect(page).toHaveURL(/\/auth\/forgot-password/);
});

test("open report call detail", async ({ page }) => {
  await page.goto("/report/call-detail/CALL-1000");
  await expect(page.getByText("Transcript hội thoại")).toBeVisible();
});
