const { test, expect } = require("@playwright/test");

test.describe("Donate page — public", () => {
  test("hero, disclaimer, QR, bank details, and FAQ sections all render", async ({ page }) => {
    await page.goto("/donate");

    await expect(page.getByRole("heading", { name: "Donate to PFM", level: 1 })).toBeVisible();

    // QR section — no real QR image exists yet, so this note is expected
    await expect(page.getByText("QR code coming soon")).toBeVisible();

    // Bank details section — real account info, no more placeholder/sample values
    await expect(page.getByText("Maybank")).toBeVisible();
    await expect(page.getByText("5642 2165 2333")).toBeVisible();

    // FAQ section
    await expect(page.getByRole("heading", { name: "Frequently Asked Questions" })).toBeVisible();
  });

  test("bank account number can be copied to clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/donate");

    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByText("Copied!")).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe("564221652333");
  });

  test("FAQ accordion opens one item at a time", async ({ page }) => {
    await page.goto("/donate");

    const firstQuestion  = page.getByRole("button", { name: "Is my donation secure?" });
    const secondQuestion = page.getByRole("button", { name: "Will I receive a receipt for my donation?" });

    // First item is open by default (defaultOpenIndex=0)
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");

    await secondQuestion.click();
    await expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
  });
});
