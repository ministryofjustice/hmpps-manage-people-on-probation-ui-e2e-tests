import "dotenv/config";
import { chromium } from "playwright";
import { loginAndGetCookies } from "./login";
import { execSync } from "node:child_process";

async function main() {
  const browser = await chromium.launch();
  let cookieHeader: string | undefined;

  try {
    const page = await browser.newPage();

    const loginResult = await loginAndGetCookies(page);
    cookieHeader = loginResult.cookieHeader;

    if (!cookieHeader?.trim()) throw new Error("cookieHeader is empty");
  } finally {
    await browser.close();
  }

  execSync("npm run perf:home", {
    stdio: "inherit",
    env: {
      ...process.env,
      PERF_COOKIE_HEADER: cookieHeader,
    },
  });
}

await main();
