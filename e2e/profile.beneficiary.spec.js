const { test, expect } = require("@playwright/test");

test.describe("Self-service profile — GET /accounts/me/ field mapping", () => {
  test("shows Active status and a real Joined date, not the nested-field-missing defaults", async ({ page }) => {
    await page.goto("/beneficiary/profile");

    // Regression check: UserProfileCard used to read is_active/created_at at the
    // top level, which /accounts/me/ doesn't have — always showed Inactive + "—".
    // Scoped to <main> — the sidebar can contain unrelated "Inactive" text (e.g. an
    // "Inactive Partners" nav item) that would otherwise false-positive this check.
    const main = page.getByRole("main");
    await expect(main.getByText("Active", { exact: true }).first()).toBeVisible();
    await expect(main.getByText("Inactive")).toHaveCount(0);

    const joinedRow = main.locator("text=Joined").locator("..");
    await expect(joinedRow.getByText("—")).toHaveCount(0);
  });

  test("shows National ID, State, and the Immigration Status section from the nested profile object", async ({ page }) => {
    await page.goto("/beneficiary/profile");
    await page.waitForLoadState("networkidle");

    // Only meaningful for a real beneficiary session — an admin/staff session
    // hitting this beneficiary-only route gets redirected elsewhere.
    test.skip(!page.url().includes("/beneficiary/profile"), "Not a beneficiary session.");

    const main = page.getByRole("main");
    await expect(main.getByText("National ID / IC Number")).toBeVisible();
    await expect(main.getByText("State", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Immigration Status" })).toBeVisible();
    await expect(main.getByText("Visa Status")).toBeVisible();
  });
});
