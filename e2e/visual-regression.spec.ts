import { test, expect } from "@playwright/test";

test("visual login desktop", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(page).toHaveScreenshot("login-desktop.png", { fullPage: true });
});

test.use({ viewport: { width: 390, height: 844 } });

test("visual login mobile", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(page).toHaveScreenshot("login-mobile.png", { fullPage: true });
});
