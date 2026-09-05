import { expect, test } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/e2e/reset");
  expect(response.ok()).toBeTruthy();
});

test("Todo sample is operable by real browser typing and clicks", async ({ page }) => {
  await page.goto("/dashboard");

  const titleInput = page.getByLabel("Todoタイトル");
  await page.getByRole("button", { name: "追加" }).click();
  expect(await titleInput.evaluate((element) => element.checkValidity())).toBe(false);
  await expect(page.getByText("まだTodoはありません。")).toBeVisible();

  await titleInput.pressSequentially("Browser E2E Todo");
  await page.getByRole("button", { name: "追加" }).click();

  const row = page.locator("[data-todo-id]").filter({ hasText: "Browser E2E Todo" });
  await expect(row).toBeVisible();
  await expect(row.locator(".todo-title")).not.toHaveClass(/done/);

  await row.getByRole("button", { name: "完了状態を切り替え" }).click();
  const completedRow = page.locator("[data-todo-id]").filter({ hasText: "Browser E2E Todo" });
  await expect(completedRow.locator(".todo-title")).toHaveClass(/done/);

  await completedRow.getByRole("button", { name: "削除" }).click();
  await expect(page.locator("[data-todo-id]")).toHaveCount(0);
  await expect(page.getByText("まだTodoはありません。")).toBeVisible();
});
