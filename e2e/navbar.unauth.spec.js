const { test, expect } = require("@playwright/test");

test.describe("Public navbar — Projects dropdown", () => {
  test("hovering the trigger then clicking a sub-link actually navigates (hover-gap regression)", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true });
    await trigger.hover();

    const subLink = page.getByRole("menuitem", { name: /All Projects/ });
    await expect(subLink).toBeVisible();
    await subLink.click();

    await expect(page).toHaveURL(/\/projects$/);
  });

  test("clicking the trigger label itself navigates to the overview page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test("dropdown is keyboard-reachable via focus", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true });
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
