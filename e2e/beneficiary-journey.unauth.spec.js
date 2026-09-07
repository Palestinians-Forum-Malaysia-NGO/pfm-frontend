const { test, expect } = require("@playwright/test");
const path = require("path");

const RESUME = path.join(__dirname, "fixtures/test-document.pdf");
const COVER_LETTER = path.join(__dirname, "fixtures/test-document.pdf");
const OPPORTUNITY_ID = "cd12dead-b858-4560-9087-8b85b7e03b2b"; // Part-Time Arabic-English Translator

// Full beneficiary journey for the account created by register.unauth.spec.js
// (zylen.team@gmail.com — approved + password set out-of-band, since both
// admin approval and the password-reset email link need a human/admin step
// that can't be scripted here). Runs as one continuous session so login
// carries through every step — no OTP involved (beneficiary accounts don't
// require 2FA), so this is safe to re-run.
const EMAIL = process.env.PLAYWRIGHT_JOURNEY_EMAIL || "zylen.team@gmail.com";
const PASSWORD = process.env.PLAYWRIGHT_JOURNEY_PASSWORD || "Admin123!@#";
// NOTE: "active"-status projects are inexplicably invisible to beneficiaries
// (GET /projects/ as this account returns only completed/upcoming ones, and
// fetching an active project's own slug 404s even though it's published —
// confirmed live, flagged separately as a likely backend bug). Using one of
// the two projects that actually are visible to this role until that's fixed.
const PROJECT_SLUG = "palestinian-national-day-commemoration-2026";

test("beneficiary: login → dashboard → profile edit → apply to a project", async ({ page }) => {
  await test.step("login via the real sign-in form", async () => {
    await page.goto("/auth/sign-in");
    await page.getByPlaceholder("you@example.com").fill(EMAIL);
    await page.getByPlaceholder("Enter your password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Invalid credentials")).not.toBeVisible();
    await page.waitForURL("**/beneficiary/default", { timeout: 15_000 });
  });

  await test.step("dashboard renders the welcome header and stat cards", async () => {
    await expect(page.getByText("Welcome back, E2E")).toBeVisible();
    await expect(page.getByText("Total Applications")).toBeVisible();
  });

  await test.step("edit self-profile: change city, save, verify it persists", async () => {
    await page.goto("/beneficiary/profile");
    await page.getByRole("button", { name: "Edit" }).first().click();

    // InputField wires htmlFor/id, so getByLabel works here (unlike SelectField).
    const cityField = page.getByLabel("Current City", { exact: true });
    const newCity = `E2E City ${Date.now()}`;
    await cityField.fill(newCity);

    const saveBtn = page.getByRole("button", { name: "Save Changes" });
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();

    await expect(page.getByText("Profile updated")).toBeVisible({ timeout: 10_000 });

    // Reload and confirm it actually persisted server-side, not just local state.
    await page.reload();
    await expect(page.getByText(newCity)).toBeVisible({ timeout: 10_000 });
  });

  await test.step("apply to a project", async () => {
    await page.goto(`/beneficiary/projects/${PROJECT_SLUG}`);
    await expect(page.getByText("Need Assistance?")).toBeVisible();

    const applyBtn = page.getByRole("button", { name: "Apply for Assistance" });
    if (await applyBtn.isVisible().catch(() => false)) {
      await applyBtn.click();
      await expect(page.getByText("Application Submitted")).toBeVisible({ timeout: 10_000 });
    } else {
      // Already applied in a previous run of this spec — fine, just confirm
      // the "already applied" state renders instead of the apply button.
      await expect(page.getByText("Application Submitted")).toBeVisible();
    }
  });

  await test.step("application shows up in My Requests", async () => {
    await page.goto("/beneficiary/requests");
    await expect(page.getByText(/Palestinian National Day/i)).toBeVisible({ timeout: 10_000 });
  });

  await test.step("apply to an opportunity — resume and cover letter both required", async () => {
    await page.goto(`/beneficiary/opportunities/${OPPORTUNITY_ID}`);
    await expect(page.getByText("Apply Now")).toBeVisible();

    const submitBtn = page.getByRole("button", { name: "Submit Application" });

    // Already-authenticated beneficiaries skip name/email/phone (pre-filled,
    // read-only) straight to resume + cover letter — both required uploads.
    // Each StorageDocumentField's <input type="file"> only exists in its
    // "dropzone" (pre-upload) state and unmounts once a file is picked, so
    // re-querying .first() after each upload naturally lands on the next
    // still-empty field rather than needing a fixed index.
    await page.locator('input[type="file"]').first().setInputFiles(RESUME);
    await expect(page.locator('input[type="file"]')).toHaveCount(1, { timeout: 15_000 }); // resume upload finished, its input unmounted
    await page.locator('input[type="file"]').first().setInputFiles(COVER_LETTER);

    await expect(submitBtn).toBeEnabled({ timeout: 15_000 }); // waits for both uploads to finish
    await submitBtn.click();

    await expect(page.getByText("Application Submitted!")).toBeVisible({ timeout: 10_000 });
  });
});
