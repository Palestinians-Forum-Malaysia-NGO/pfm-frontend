const { test, expect } = require("@playwright/test");

test.describe("Users create form — all fields required, no Role picker", () => {
  test("submit stays disabled until every field is filled; Role dropdown is gone", async ({ page }) => {
    await page.goto("/admin/users/create");

    // Role/payment-frequency selects were removed — this form has zero <select> elements
    await expect(page.locator("select")).toHaveCount(0);

    const submit = page.getByRole("button", { name: "Create User" });
    await expect(submit).toBeDisabled();

    // Fill only name/email/phone — still missing employment & banking fields
    await page.getByPlaceholder("John Doe").fill("E2E Test User");
    await page.getByPlaceholder("john@example.com").fill(`e2e.${Date.now()}@example.com`);
    await page.getByPlaceholder("+60 12-345 6789").first().fill("+60123456789");
    await expect(submit).toBeDisabled();
  });

  test("profile photo upload widget renders", async ({ page }) => {
    await page.goto("/admin/users/create");
    await expect(page.getByText("Upload Photo")).toBeVisible();
  });
});

test.describe("Staff create form — all fields required, no activation-email banner", () => {
  test("activation email notice banner was removed", async ({ page }) => {
    await page.goto("/admin/staff/create");
    await expect(page.getByText(/automatically sends an activation email/i)).toHaveCount(0);
  });

  test("submit stays disabled until every field is filled", async ({ page }) => {
    await page.goto("/admin/staff/create");

    const submit = page.getByRole("button", { name: "Add Staff Member" });
    await expect(submit).toBeDisabled();

    await page.getByPlaceholder("Fatima Ali").fill("E2E Staff");
    await page.getByPlaceholder("fatima@pfm.org.my").fill(`e2e.staff.${Date.now()}@example.com`);
    await expect(submit).toBeDisabled();
  });
});
