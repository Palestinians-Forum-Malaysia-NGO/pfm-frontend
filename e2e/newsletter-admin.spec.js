const { test, expect } = require("@playwright/test");

const SUBSCRIBERS_BASE    = "/admin/newsletter/subscribers";
const NOTIFICATIONS_BASE  = "/admin/newsletter/notifications";

async function waitForTableOrEmpty(page, emptyText) {
  await expect(
    page.locator("table").or(page.getByText(emptyText))
  ).toBeVisible({ timeout: 10_000 });
}

test.describe("Newsletter — Subscribers (admin, read-only)", () => {

  test("list loads with heading, stat cards, and no Add button", async ({ page }) => {
    await page.goto(SUBSCRIBERS_BASE);

    await expect(page.getByRole("main").getByRole("heading", { name: "Subscribers", level: 1 })).toBeVisible();

    // Stat cards — clickable buttons, distinct from the "Active"/"Unsubscribed" <option> text in the status filter
    await expect(page.getByRole("button", { name: /Total$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Active$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Unsubscribed$/ })).toBeVisible();

    // No write API exists for subscribers — no "Add" button anywhere
    await expect(page.getByRole("button", { name: /^Add/ })).toHaveCount(0);

    await waitForTableOrEmpty(page, "No subscribers found");
  });

  test("table has no Actions column — nothing to do to a row", async ({ page }) => {
    await page.goto(SUBSCRIBERS_BASE);
    await waitForTableOrEmpty(page, "No subscribers found");

    const hasRows = (await page.locator("table tbody tr").count()) > 0;
    test.skip(!hasRows, "no subscriber rows to inspect on this environment");

    await expect(page.locator("table thead").getByText("Actions")).toHaveCount(0);
  });

  test("search filters the list and clears", async ({ page }) => {
    await page.goto(SUBSCRIBERS_BASE);
    await waitForTableOrEmpty(page, "No subscribers found");

    const searchInput = page.getByPlaceholder("Search by email…");
    await searchInput.fill("this-email-should-not-exist-anywhere@example.invalid");
    await page.waitForTimeout(500); // debounce

    await expect(page.getByText("No subscribers found")).toBeVisible({ timeout: 8_000 });

    // Clear button appears once a filter is active, resets the search box
    await page.getByRole("button", { name: "Clear" }).click();
    await expect(searchInput).toHaveValue("");
  });

  test("status filter toggles between Active / Unsubscribed / All", async ({ page }) => {
    await page.goto(SUBSCRIBERS_BASE);
    await waitForTableOrEmpty(page, "No subscribers found");

    const statusFilter = page.locator("select").first();
    await statusFilter.selectOption("active");
    await waitForTableOrEmpty(page, "No subscribers found");

    await statusFilter.selectOption("unsubscribed");
    await waitForTableOrEmpty(page, "No subscribers found");

    await statusFilter.selectOption("all");
    await waitForTableOrEmpty(page, "No subscribers found");
  });

});

test.describe("Newsletter — Notifications (admin, read-only audit trail)", () => {

  test("list loads with heading, stat cards, and source filter", async ({ page }) => {
    await page.goto(NOTIFICATIONS_BASE);

    await expect(page.getByRole("main").getByRole("heading", { name: "Notifications", level: 1 })).toBeVisible();
    await expect(page.getByText("Total")).toBeVisible();

    await waitForTableOrEmpty(page, "No notifications found");

    // Source filter select is present regardless of whether there's data
    await expect(page.locator("select").first()).toBeVisible();
  });

  test("source filter narrows the list", async ({ page }) => {
    await page.goto(NOTIFICATIONS_BASE);
    await waitForTableOrEmpty(page, "No notifications found");

    const sourceFilter = page.locator("select").first();
    for (const value of ["news", "project", "event", "all"]) {
      await sourceFilter.selectOption(value);
      await waitForTableOrEmpty(page, "No notifications found");
    }
  });

  test("row click / view action navigates to notification detail", async ({ page }) => {
    await page.goto(NOTIFICATIONS_BASE);
    await waitForTableOrEmpty(page, "No notifications found");

    const hasRows = (await page.locator("table tbody tr").count()) > 0;
    test.skip(!hasRows, "no notifications exist yet on this environment — nothing to publish a News/Project/Event through in this test");

    await page.locator("table tbody tr").first().click();

    await expect(page).toHaveURL(new RegExp(`${NOTIFICATIONS_BASE}/[^/]+$`));
    await expect(page.getByText("Notification Info")).toBeVisible();
    await expect(page.getByText("Recipients")).toBeVisible();
    await expect(page.getByText("Sent At")).toBeVisible();

    // Back button returns to the list
    await page.getByRole("button", { name: "Back" }).click();
    await page.waitForURL(`**${NOTIFICATIONS_BASE}`, { timeout: 10_000 });
  });

});
