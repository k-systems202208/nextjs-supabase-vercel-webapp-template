import { expect, test } from "@playwright/test";

test("invite-only mode blocks self signup and protects app routes", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/auth\/login\?next=%2Fdashboard/);
  await expect(page.getByText("このアプリは招待制です。")).toBeVisible();
  await expect(page.getByRole("link", { name: "新規アカウントを作成" })).toHaveCount(0);

  await page.goto("/auth/sign-up");
  await expect(page).toHaveURL(/\/auth\/login\?message=/);
  await expect(
    page.getByText("このアプリは招待制です。招待済みアカウントでログインしてください。"),
  ).toBeVisible();

  await page.goto("/dashboard");
  await page.getByLabel("メールアドレス").pressSequentially("invited@example.test");
  await page.getByLabel("パスワード", { exact: true }).pressSequentially("abcdefgh");
  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
});

test("login next parameter never redirects outside the application", async ({ page }) => {
  await page.goto("/auth/login?next=https://example.com");
  await page.getByLabel("メールアドレス").fill("invited@example.test");
  await page.getByLabel("パスワード", { exact: true }).fill("abcdefgh");
  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page).not.toHaveURL(/example\.com/);
});
