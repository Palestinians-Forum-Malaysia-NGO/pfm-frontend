const { test, expect } = require("@playwright/test");

// admin requires OTP on every login (2FA enabled) — a plain form-submit
// can't complete that handshake unattended, so it needs a live code via
// PLAYWRIGHT_OTP and is skipped otherwise. See e2e/auth.setup.js for the
// API-level login+OTP handshake used for the rest of the suite.
const ACCOUNTS = [
  {
    role: "admin",
    email: "pfmy.it@gmail.com",
    password: "Admin123!@#",
    homePattern: "**/admin/default",
    visibleNav: ["Users", "Staff", "Beneficiaries", "Projects"],
    hiddenNav: [],
    requiresOtp: true,
  },
  {
    role: "beneficiary",
    email: "adnanmadi417@gmail.com",
    password: "Admin123!@#",
    homePattern: "**/beneficiary/default",
    // Beneficiaries have their own scoped "Projects" (browse/apply), distinct
    // from admin/staff's project-management pages — it's expected to show.
    visibleNav: ["Dashboard", "My Requests", "Profile", "Projects"],
    // Beneficiary portal has no admin/staff management pages at all
    hiddenNav: ["Users", "Staff", "Beneficiaries", "Classifications", "Categories"],
  },
  // No real staff credential available yet — re-add here once one exists.
];

for (const account of ACCOUNTS) {
  test.describe(`Login — ${account.role} via real sign-in form`, () => {
    test(`${account.role} logs in and lands on ${account.homePattern}`, async ({ page }) => {
      test.skip(account.requiresOtp && !process.env.PLAYWRIGHT_OTP,
        "Requires a live OTP — re-run with PLAYWRIGHT_OTP=<code> after triggering a fresh login.");

      await page.goto("/auth/sign-in");

      // Use placeholder selectors — inputs lack htmlFor/id (see classifications.spec.js)
      await page.getByPlaceholder("you@example.com").fill(account.email);
      await page.getByPlaceholder("Enter your password").fill(account.password);
      await page.getByRole("button", { name: "Sign In" }).click();

      // No error banner
      await expect(page.getByText("Invalid credentials")).not.toBeVisible();

      if (account.requiresOtp) {
        // The 6-digit input has no htmlFor/id/placeholder text to target —
        // it's the only inputmode="numeric" field on this step.
        await page.locator('input[inputmode="numeric"]').fill(process.env.PLAYWRIGHT_OTP.trim());
        await page.getByRole("button", { name: /verify/i }).click();
      }

      await page.waitForURL(account.homePattern, { timeout: 15_000 });

      // Sidebar reflects the correct role's permissions.
      // Nav items with children (Users, Staff, Projects) render as accordion
      // <button>s, leaf items (Beneficiaries) render as <a> links — so match
      // on visible text within the nav landmark rather than a specific role.
      const nav = page.getByRole("navigation");
      for (const label of account.visibleNav) {
        await expect(nav.getByText(label, { exact: true })).toBeVisible();
      }
      for (const label of account.hiddenNav) {
        await expect(nav.getByText(label, { exact: true })).toHaveCount(0);
      }
    });
  });
}
