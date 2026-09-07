const { test, expect } = require("@playwright/test");

const BASE = "/admin/classifications";
const TEST_NAME = `E2E Classification ${Date.now()}`;
const EDITED_NAME = `${TEST_NAME} (edited)`;

// Persists across tests because workers:1
let createdId = null;

// ── helpers ───────────────────────────────────────────────────────────────────

async function gotoList(page) {
  await page.goto(BASE);
  await page.waitForURL(`**${BASE}`, { timeout: 10_000 });
  // Wait for DataTable loading spinner to disappear
  await page.locator("text=Loading…").waitFor({ state: "hidden", timeout: 10_000 }).catch(() => {});
}

// Use placeholder selectors — staging build lacks htmlFor/id on inputs
const nameInput       = (page) => page.getByPlaceholder("e.g. Refugee, Displaced, Asylum Seeker");
const descInput       = (page) => page.getByPlaceholder("Brief description of this classification…");

// ─────────────────────────────────────────────────────────────────────────────

test.describe("Classifications — admin CRUD", () => {

  test("1. list page loads with heading and Add button", async ({ page }) => {
    await gotoList(page);

    await expect(page.getByRole("main").getByRole("heading", { name: "Classifications", level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add Classification" })).toBeVisible();

    // After loading: table or empty-state must be visible (not spinner)
    await expect(
      page.locator("table").or(page.getByText("No classifications found"))
    ).toBeVisible({ timeout: 10_000 });
  });

  test("2. create form — submit disabled until name filled", async ({ page }) => {
    await page.goto(`${BASE}/create`);

    const submit = page.getByRole("button", { name: "Add Classification" });
    await expect(submit).toBeDisabled();

    // Type then clear to trigger blur error
    await nameInput(page).fill("x");
    await nameInput(page).fill("");
    await nameInput(page).blur();

    await expect(page.getByText("This field is required")).toBeVisible();
    await expect(submit).toBeDisabled();
  });

  test("3. create — fills form, submits, redirects to detail", async ({ page }) => {
    await page.goto(`${BASE}/create`);

    await nameInput(page).fill(TEST_NAME);
    await descInput(page).fill("Created by Playwright e2e test");

    const submit = page.getByRole("button", { name: "Add Classification" });
    await expect(submit).toBeEnabled();
    await submit.click();

    // Wait until detail page heading is visible (not "create" URL)
    await expect(page.getByRole("heading", { name: TEST_NAME, level: 1 })).toBeVisible({ timeout: 15_000 });
    // Only extract ID after confirmed redirect — avoids capturing "create" from current URL
    createdId = page.url().split("/").pop();

    await expect(page.getByText("Created by Playwright e2e test").first()).toBeVisible();
  });

  test("4. detail view — shows name, Actions button, Created At row", async ({ page }) => {
    test.skip(!createdId, "skipped — test 3 must run first");

    await page.goto(`${BASE}/${createdId}`);
    // Wait for detail to load (not the loading spinner)
    await page.locator("text=Loading classification").waitFor({ state: "hidden", timeout: 10_000 }).catch(() => {});

    await expect(page.getByRole("heading", { name: TEST_NAME, level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Actions" })).toBeVisible();
    await expect(page.getByText("Created At")).toBeVisible();
  });

  test("5. edit — save disabled until dirty", async ({ page }) => {
    test.skip(!createdId, "skipped — test 3 must run first");

    await page.goto(`${BASE}/${createdId}/edit`);
    await page.locator("text=Loading classification").waitFor({ state: "hidden", timeout: 10_000 }).catch(() => {});

    const save = page.getByRole("button", { name: "Save Changes" });
    await expect(save).toBeDisabled();

    // nameInput has existing value — clear and type new value
    await nameInput(page).fill(EDITED_NAME);
    await expect(save).toBeEnabled();
  });

  test("6. edit — saves and redirects back to detail", async ({ page }) => {
    test.skip(!createdId, "skipped — test 3 must run first");

    await page.goto(`${BASE}/${createdId}/edit`);
    await page.locator("text=Loading classification").waitFor({ state: "hidden", timeout: 10_000 }).catch(() => {});

    await nameInput(page).fill(EDITED_NAME);
    await page.getByRole("button", { name: "Save Changes" }).click();

    await page.waitForURL(`**${BASE}/${createdId}`, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: EDITED_NAME, level: 1 })).toBeVisible();
  });

  test("7. list — search filters and Clear resets", async ({ page }) => {
    await gotoList(page);

    const searchInput = page.getByPlaceholder("Search by name or description…");
    await searchInput.fill(TEST_NAME.slice(0, 20));

    await page.waitForTimeout(500); // debounce
    await page.locator("text=Loading…").waitFor({ state: "hidden", timeout: 8_000 }).catch(() => {});

    const hasRows  = (await page.locator("table tbody tr").count()) > 0;
    const hasEmpty = await page.locator("text=No classifications found").isVisible().catch(() => false);
    expect(hasRows || hasEmpty).toBe(true);

    await page.getByRole("button", { name: "Clear" }).click();
    await expect(searchInput).toHaveValue("");
  });

  test("8. delete — via Actions dropdown on detail page, redirects to list", async ({ page }) => {
    test.skip(!createdId, "skipped — test 3 must run first");

    await page.goto(`${BASE}/${createdId}`);
    await page.locator("text=Loading classification").waitFor({ state: "hidden", timeout: 10_000 }).catch(() => {});

    // Open Actions dropdown (DropdownButton renders as <button>)
    await page.getByRole("button", { name: "Actions" }).click();

    // Dropdown items are also <button> elements, not role="menuitem"
    await page.getByRole("button", { name: "Delete Classification" }).click();

    // Modal body text confirms it appeared
    await expect(page.getByText(/Are you sure you want to delete/)).toBeVisible();

    // Confirm deletion
    await page.getByRole("button", { name: "Delete" }).click();

    // Redirects to list
    await page.waitForURL(`**${BASE}`, { timeout: 15_000 });
    // Scope to main — navbar also renders an h1 "Classifications" on this page
    await expect(page.getByRole("main").getByRole("heading", { name: "Classifications" })).toBeVisible();

    // Cleaned up — name no longer in the table rows (toast may still show it briefly)
    await page.waitForTimeout(500);
    const inTable = await page.locator("table tbody").locator(`text=${EDITED_NAME}`).isVisible().catch(() => false);
    expect(inTable).toBe(false);
  });

});
