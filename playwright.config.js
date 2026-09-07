// @ts-check
const path = require("path");
const { defineConfig, devices } = require("@playwright/test");

// Real test-account credentials live in e2e/.env.e2e (gitignored, local-only
// — see e2e/.env.e2e.example for the required keys). Never hardcode a real
// email/password in a committed spec file.
require("dotenv").config({ path: path.join(__dirname, "e2e/.env.e2e") });

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  retries: 0,
  workers: 1,
  reporter: "list",

  use: {
    // Defaults to the local dev server so tests reflect uncommitted/unpushed
    // work. Point at staging with: set PW_BASE_URL=https://staging.pfmy.org
    baseURL: process.env.PW_BASE_URL || "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 900 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  projects: [
    { name: "setup", testMatch: /auth\.setup\.js/ },
    {
      // No storageState/dependency — starts every test logged out.
      // For specs that exercise sign-in/register/forgot-password themselves.
      name: "unauth",
      testMatch: /\.unauth\.spec\.js$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // Logged-out specs (*.unauth.spec.js) run under the "unauth" project
      // above — exclude them here so they don't also run pre-authenticated.
      name: "chromium",
      testIgnore: /\.unauth\.spec\.js$/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/admin.json",
      },
      dependencies: ["setup"],
    },
    {
      // Admin-only specs (e.g. classifications.spec.js) will fail under this
      // role's session — give staff-only specs a *.staff.spec.js suffix and
      // this testMatch will pick them up without breaking the admin suite.
      name: "staff",
      testMatch: /\.staff\.spec\.js$/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/staff.json",
      },
      dependencies: ["setup"],
    },
    {
      // Give beneficiary-only specs a *.beneficiary.spec.js suffix.
      name: "beneficiary",
      testMatch: /\.beneficiary\.spec\.js$/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/beneficiary.json",
      },
      dependencies: ["setup"],
    },
  ],
});
