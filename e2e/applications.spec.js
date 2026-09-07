const { test, expect } = require("@playwright/test");

test.describe("Applications — reject flow validation", () => {
  test("reject requires a 10+ character reason before it can be submitted", async ({ page }) => {
    // The default "all" view can have many non-pending rows ahead of any
    // pending one (the list endpoint has no created_at to sort by) — filter
    // to pending directly via the URL param the list page reads.
    await page.goto("/admin/applications?status=pending");
    await page.waitForLoadState("networkidle");

    // Approve/Reject icons only render for status === "pending" — skip cleanly
    // if there's currently no pending application to test against, rather
    // than timing out waiting for a button that will never appear.
    // (.count() is a one-shot check, not an auto-retrying assertion, so the
    // networkidle wait above is what makes this reliable, not the count call.)
    const rejectRowButtons = page.getByRole("button", { name: "Reject", exact: true });
    test.skip(await rejectRowButtons.count() === 0, "No pending applications available right now.");

    await rejectRowButtons.first().click();

    // Modal is portaled to <body> — scope queries to its backdrop wrapper so
    // "Reject" (row icon title) and "Reject" (modal confirm button text)
    // don't collide.
    const modal = page.locator(".fixed.inset-0.z-50");
    await expect(modal.getByRole("heading", { name: "Reject Application" })).toBeVisible();

    const reasonInput = page.getByLabel("Reason for Rejection");
    const confirmBtn  = modal.getByRole("button", { name: "Reject", exact: true });

    // Empty reason — disabled
    await expect(confirmBtn).toBeDisabled();

    // Under 10 characters — still disabled
    await reasonInput.fill("too short");
    await expect(confirmBtn).toBeDisabled();

    // 10+ characters — enabled
    await reasonInput.fill("This project no longer fits the beneficiary's needs.");
    await expect(confirmBtn).toBeEnabled();

    // Close without submitting — this test only verifies client-side
    // validation, it must not mutate a real application record.
    await modal.getByRole("button", { name: "Cancel" }).click();
    await expect(modal).toHaveCount(0);
  });
});
