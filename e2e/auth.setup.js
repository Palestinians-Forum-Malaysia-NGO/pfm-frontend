const { test: setup } = require("@playwright/test");
const path = require("path");

const API  = "https://staging-api.pfmy.org/api/v1";
const EMAIL    = "pfmy.it@gmail.com";
const PASSWORD = "Admin123!@#";
const AUTH_FILE = path.join(__dirname, ".auth/admin.json");

setup.setTimeout(30_000);

setup("authenticate as admin", async ({ page, request }) => {
  // ── Step 1: Login (triggers OTP to email) ──────────────────────────────────
  const loginRes = await request.post(`${API}/auth/login/`, {
    data: { email: EMAIL, password: PASSWORD },
  });
  const loginData = await loginRes.json();

  let access, refresh;

  if (loginData.requires_otp) {
    const otp = process.env.PLAYWRIGHT_OTP;
    if (!otp) {
      throw new Error(
        "\n\n  OTP sent to pfmy.it@gmail.com.\n" +
        "  Check your email, then re-run:\n\n" +
        "    set PLAYWRIGHT_OTP=<code> && npx playwright test --project=setup\n"
      );
    }

    // ── Step 2: Verify OTP ──────────────────────────────────────────────────
    const otpRes = await request.post(`${API}/auth/verify-otp/`, {
      data: { email: EMAIL, code: otp.trim(), purpose: "login" },
    });
    const otpData = await otpRes.json();
    if (!otpData.access) throw new Error(`OTP verify failed: ${JSON.stringify(otpData)}`);
    access  = otpData.access;
    refresh = otpData.refresh;
  } else {
    if (!loginData.access) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    access  = loginData.access;
    refresh = loginData.refresh;
  }

  // ── Step 3: Inject tokens into localStorage via the browser ────────────────
  await page.goto("https://staging.pfmy.org/auth/sign-in");
  await page.evaluate(({ access, refresh }) => {
    localStorage.setItem("access",  access);
    localStorage.setItem("refresh", refresh);
  }, { access, refresh });

  // ── Step 4: Verify the session works ───────────────────────────────────────
  await page.goto("https://staging.pfmy.org/admin/default");
  await page.waitForURL("**/admin/**", { timeout: 15_000 });

  // Save the storage state (localStorage + cookies)
  await page.context().storageState({ path: AUTH_FILE });
  console.log("✅ Session saved to", AUTH_FILE);
});
