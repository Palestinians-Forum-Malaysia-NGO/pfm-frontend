const { test, expect } = require("@playwright/test");
const path = require("path");

// Full beneficiary registration wizard (steps 1-4), driven through the real
// UI against the real create-beneficiary + OTP-send API. This intentionally
// stops at the OTP step — completing verification needs a live emailed code,
// which can't survive a second `npx playwright test` invocation (submitting
// step 4 again would send a fresh OTP and invalidate whatever code a human
// relays back). See e2e/auth.setup.js for how that final hop is completed
// via a single direct API call instead.
// A fresh plus-alias per run — registration rejects an already-used email
// ("Email already registered."), so a fixed address only works once. Mail
// still lands in the same real inbox for anyone who needs to see it.
const EMAIL = process.env.PLAYWRIGHT_REGISTER_EMAIL || `zylen.team+e2e${Date.now()}@gmail.com`;
const PHOTO = path.join(__dirname, "fixtures/test-photo.png");
const ID_DOC = path.join(__dirname, "fixtures/test-document.pdf");

test("beneficiary completes the registration wizard through to the OTP step", async ({ page }) => {
  await page.goto("/apply");

  // ── Step 1: Account ──────────────────────────────────────────────
  await page.locator('input[type="file"]').first().setInputFiles(PHOTO);
  await page.getByPlaceholder("Ahmad Faris bin Abdullah").fill("E2E Test Beneficiary");
  await page.getByPlaceholder("you@example.com").fill(EMAIL);
  await page.getByPlaceholder("+60 12-345 6789").fill("+60123456780");
  const continueBtn = page.getByRole("button", { name: "Continue" });
  await expect(continueBtn).toBeEnabled({ timeout: 15_000 }); // waits for photo upload to finish
  await continueBtn.click();

  // ── Step 2: Family ── all fields optional, just advance ─────────
  await page.getByRole("button", { name: "Continue" }).click();

  // ── Step 3: Documents ────────────────────────────────────────────
  // national_id must be unique too — a fixed value only works once.
  const uniqueSuffix = String(Date.now()).slice(-4);
  await page.getByPlaceholder("e.g. 900101-14-5678").fill(`990101-14-${uniqueSuffix}`);
  await page.getByPlaceholder("Brief background about your situation…").fill(
    "E2E test registration — background info for automated testing."
  );
  await page.locator('input[type="file"]').first().setInputFiles(ID_DOC);
  const continueBtn3 = page.getByRole("button", { name: "Continue" });
  await expect(continueBtn3).toBeEnabled({ timeout: 15_000 }); // waits for ID doc upload to finish
  await continueBtn3.click();

  // ── Step 4: Status, country & terms ──────────────────────────────
  const selects = page.locator("select");
  await selects.nth(0).selectOption("false");       // has_visa = No
  await selects.nth(1).selectOption("undocumented"); // situation
  await selects.nth(2).selectOption("PS");           // country_of_origin = Palestine
  await selects.nth(3).selectOption("gaza");         // palestine_region
  await selects.nth(4).selectOption("selangor");     // state
  await page.getByPlaceholder("No. 1, Jalan…").fill("No. 1, Jalan Testing, Selangor");
  // ToggleInput's caption label isn't clickable — the switch itself is the
  // wrapping <label> showing "Enabled"/"Disabled" + "Click to toggle".
  await page.getByText("Click to toggle").click(); // terms toggle

  const submitBtn = page.getByRole("button", { name: /submit application/i });
  await expect(submitBtn).toBeEnabled();
  await submitBtn.click();

  // ── OTP step ──────────────────────────────────────────────────────
  await expect(page.getByText("Verify your account")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(EMAIL)).toBeVisible();

  console.log(`✅ Registration submitted for ${EMAIL} — OTP sent, awaiting live code.`);
});
