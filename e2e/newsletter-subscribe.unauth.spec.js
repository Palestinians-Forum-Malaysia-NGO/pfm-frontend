const { test, expect } = require("@playwright/test");

const TEST_EMAIL = `e2e-newsletter-${Date.now()}@example.com`;

test.describe("Newsletter — public subscribe form (homepage)", () => {

  test("section renders with heading and subscribe form", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Get Our Newsletter", level: 2 })).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(page.getByRole("button", { name: "Subscribe" })).toBeVisible();
  });

  test("submitting a real-looking email shows the success state", async ({ page }) => {
    await page.goto("/");

    const emailInput = page.getByPlaceholder("your@email.com");
    await emailInput.fill(TEST_EMAIL);
    await page.getByRole("button", { name: "Subscribe" }).click();

    await expect(page.getByText("You're subscribed — thank you!")).toBeVisible({ timeout: 15_000 });
  });

});

test.describe("Newsletter — public unsubscribe page", () => {

  test("a bogus token renders the error state, not a crash", async ({ page }) => {
    await page.goto("/newsletter/unsubscribe/00000000-0000-0000-0000-000000000000");

    await expect(page.getByText("Something went wrong")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("link", { name: "Back to Home" })).toBeVisible();
  });

});
