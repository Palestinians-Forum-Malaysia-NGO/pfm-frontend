const { test, expect } = require("@playwright/test");

test.describe("Donate page — public", () => {
  test("hero, disclaimer, QR, bank details, and FAQ sections all render", async ({ page }) => {
    await page.goto("/donate");

    await expect(page.getByRole("heading", { name: "Donate to PFM", level: 1 })).toBeVisible();

    // Placeholder-data disclaimer must be visible so nobody mistakes sample data for real
    await expect(page.getByText(/sample placeholders/i)).toBeVisible();

    // QR section
    await expect(page.getByText("QR code coming soon")).toBeVisible();

    // Bank details section — sample values, obviously fake
    await expect(page.getByText("Sample Bank Berhad")).toBeVisible();
    await expect(page.getByText("0000 0000 0000")).toBeVisible();

    // FAQ section
    await expect(page.getByRole("heading", { name: "Frequently Asked Questions" })).toBeVisible();
  });

  test("bank account number can be copied to clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/donate");

    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByText("Copied!")).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe("000000000000");
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

  test("navbar Donate link has no dropdown and navigates directly", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Main navigation").getByRole("link", { name: "Donate", exact: true }).click();
    await expect(page).toHaveURL(/\/donate$/);
  });
});
