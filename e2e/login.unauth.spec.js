const { test, expect } = require("@playwright/test");

const ACCOUNTS = [
  {
    role: "admin",
    email: "pfmy.it@gmail.com",
    password: "Admin123!@#",
    homePattern: "**/admin/default",
    visibleNav: ["Users", "Staff", "Beneficiaries", "Projects"],
    hiddenNav: [],
  },
  {
    role: "staff",
    email: "adnanmadi417@gmail.com",
    password: "Admin123!@#",
    homePattern: "**/staff/default",
    visibleNav: ["Beneficiaries", "Projects"],
    // Staff Portal Pattern: same pages as admin minus user & staff management
    hiddenNav: ["Users", "Staff"],
  },
  {
    role: "beneficiary",
    email: "adnan.madi@student.aiu.edu.my",
    password: "Admin123!@#",
    homePattern: "**/beneficiary/default",
    visibleNav: ["Dashboard", "My Requests", "Profile"],
    // Beneficiary portal has no admin/staff management pages at all
    hiddenNav: ["Users", "Staff", "Beneficiaries", "Projects", "Classifications", "Categories"],
  },
];

for (const account of ACCOUNTS) {
  test.describe(`Login — ${account.role} via real sign-in form`, () => {
    test(`${account.role} logs in and lands on ${account.homePattern}`, async ({ page }) => {
      await page.goto("/auth/sign-in");

      // Use placeholder selectors — inputs lack htmlFor/id (see classifications.spec.js)
      await page.getByPlaceholder("you@example.com").fill(account.email);
      await page.getByPlaceholder("Enter your password").fill(account.password);
      await page.getByRole("button", { name: "Sign In" }).click();

      // No error banner
      await expect(page.getByText("Invalid credentials")).not.toBeVisible();

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
