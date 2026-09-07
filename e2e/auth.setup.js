const { test: setup } = require("@playwright/test");
const path = require("path");

const API = "https://staging-api.pfmy.org/api/v1";

// Real credentials come from e2e/.env.e2e (gitignored, loaded via dotenv in
// playwright.config.js) — never hardcode a real email/password here.
const ACCOUNTS = [
  {
    role: "admin",
    email: process.env.E2E_ADMIN_EMAIL,
    password: process.env.E2E_ADMIN_PASSWORD,
    requiresOtp: true,
    homePattern: "**/admin/**",
    authFile: path.join(__dirname, ".auth/admin.json"),
  },
  {
    role: "beneficiary",
    email: process.env.E2E_BENEFICIARY_EMAIL,
    password: process.env.E2E_BENEFICIARY_PASSWORD,
    requiresOtp: false,
    homePattern: "**/beneficiary/**",
    authFile: path.join(__dirname, ".auth/beneficiary.json"),
  },
  {
    role: "staff",
    email: process.env.E2E_STAFF_EMAIL,
    password: process.env.E2E_STAFF_PASSWORD,
    requiresOtp: true,
    homePattern: "**/staff/**",
    authFile: path.join(__dirname, ".auth/staff.json"),
  },
];

setup.setTimeout(30_000);

for (const account of ACCOUNTS) {
  setup(`authenticate as ${account.role}`, async ({ page, request }) => {
    setup.skip(!account.email || !account.password,
      `Missing credentials — copy e2e/.env.e2e.example to e2e/.env.e2e and fill in E2E_${account.role.toUpperCase()}_EMAIL/PASSWORD.`);

    const otp = process.env.PLAYWRIGHT_OTP;
    let access, refresh;

    if (account.requiresOtp && otp) {
      // A code from a previous run's login is already in hand — verify it
      // directly. Do NOT call /auth/login again first: that sends a fresh
      // OTP and invalidates this one before we get to use it.
      const otpRes = await request.post(`${API}/auth/otp/verify`, {
        data: { email: account.email, code: otp.trim(), purpose: "login" },
      });
      const otpData = await otpRes.json();
      if (!otpData.access) throw new Error(`OTP verify failed: ${JSON.stringify(otpData)}`);
      access  = otpData.access;
      refresh = otpData.refresh;
    } else {
      // ── Step 1: Login (triggers OTP to email if 2FA is enabled) ────────────
      const loginRes = await request.post(`${API}/auth/login`, {
        data: { email: account.email, password: account.password },
      });
      const loginData = await loginRes.json();

      if (loginData.requires_otp) {
        throw new Error(
          `\n\n  OTP sent to ${account.email}.\n` +
          "  Check your email, then re-run:\n\n" +
          `    PLAYWRIGHT_OTP=<code> npx playwright test --project=setup\n`
        );
      }
      if (!loginData.access) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
      access  = loginData.access;
      refresh = loginData.refresh;
    }

    // ── Step 3: Inject tokens into localStorage via the browser ──────────────
    await page.goto("/auth/sign-in");
    await page.evaluate(({ access, refresh }) => {
      localStorage.setItem("access",  access);
      localStorage.setItem("refresh", refresh);
    }, { access, refresh });

    // ── Step 4: Verify the session works ──────────────────────────────────────
    await page.goto(`/${account.role}/default`);
    await page.waitForURL(account.homePattern, { timeout: 15_000 });

    // Save the storage state (localStorage + cookies)
    await page.context().storageState({ path: account.authFile });
    console.log(`✅ ${account.role} session saved to`, account.authFile);
  });
}
