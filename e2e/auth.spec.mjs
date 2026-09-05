import { expect, test } from "@playwright/test";

test("auth forms accept real keyboard input and submit in E2E mode", async ({ page }) => {
  await page.goto("/auth/sign-up");

  const signUpEmail = page.getByLabel("メールアドレス");
  const signUpPassword = page.getByLabel("パスワード（8文字以上）");

  await signUpEmail.pressSequentially("user@example.test");
  await signUpPassword.pressSequentially("short7");
  await page.getByRole("button", { name: "アカウント作成" }).click();

  await expect(page).toHaveURL(/\/auth\/sign-up$/);
  expect(await signUpPassword.evaluate((element) => element.checkValidity())).toBe(false);

  await signUpPassword.fill("");
  await signUpPassword.pressSequentially("abcdefgh");
  await page.getByRole("button", { name: "アカウント作成" }).click();

  await expect(page).toHaveURL(/\/auth\/login\?message=/);
  await expect(page.getByText("E2E: アカウント作成フォーム送信を確認しました。")).toBeVisible();

  const loginEmail = page.getByLabel("メールアドレス");
  const loginPassword = page.getByLabel("パスワード", { exact: true });
  await loginEmail.pressSequentially("user@example.test");
  await loginPassword.pressSequentially("abcdefgh");
  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Next.js + Supabase + Vercel", exact: true })).toBeVisible();
});
