const { test: setup } = require("@playwright/test");
const path = require("path");

const API = "https://staging-api.pfmy.org/api/v1";

const ACCOUNTS = [
  {
    role: "admin",
    email: "pfmy.it@gmail.com",
    password: "Admin123!@#",
    homePattern: "**/admin/**",
    authFile: path.join(__dirname, ".auth/admin.json"),
  },
  {
    role: "staff",
    email: "adnanmadi417@gmail.com",
    password: "Admin123!@#",
    homePattern: "**/staff/**",
    authFile: path.join(__dirname, ".auth/staff.json"),
  },
  {
    role: "beneficiary",
    email: "adnan.madi@student.aiu.edu.my",
    password: "Admin123!@#",
    homePattern: "**/beneficiary/**",
    authFile: path.join(__dirname, ".auth/beneficiary.json"),
  },
];

setup.setTimeout(30_000);

for (const account of ACCOUNTS) {
  setup(`authenticate as ${account.role}`, async ({ page, request }) => {
    // ── Step 1: Login (triggers OTP to email if 2FA is enabled) ────────────────
    const loginRes = await request.post(`${API}/auth/login`, {
      data: { email: account.email, password: account.password },
    });
    const loginData = await loginRes.json();

    let access, refresh;

    if (loginData.requires_otp) {
      const otp = process.env.PLAYWRIGHT_OTP;
      if (!otp) {
        throw new Error(
          `\n\n  OTP sent to ${account.email}.\n` +
          "  Check your email, then re-run:\n\n" +
          `    set PLAYWRIGHT_OTP=<code> && npx playwright test --project=setup\n`
        );
      }

      // ── Step 2: Verify OTP ────────────────────────────────────────────────
      const otpRes = await request.post(`${API}/auth/otp/verify`, {
        data: { email: account.email, code: otp.trim(), purpose: "login" },
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
