const { test, expect } = require("@playwright/test");

test.describe("Self-service profile — GET /accounts/me/ field mapping", () => {
  test("shows Active status and a real Joined date, not the nested-field-missing defaults", async ({ page }) => {
    await page.goto("/beneficiary/profile");

    // Regression check: UserProfileCard used to read is_active/created_at at the
    // top level, which /accounts/me/ doesn't have — always showed Inactive + "—".
    await expect(page.getByText("Active", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Inactive")).toHaveCount(0);

    const joinedRow = page.locator("text=Joined").locator("..");
    await expect(joinedRow.getByText("—")).toHaveCount(0);
  });
});
