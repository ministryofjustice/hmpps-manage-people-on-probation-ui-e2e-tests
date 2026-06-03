import { expect, type Page } from "@playwright/test";
import HomePage from "../pageObjects/home.page";

export const login = async (page: Page) => {
  await page.goto(process.env.MANAGE_PEOPLE_ON_PROBATION_URL!);
  await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/);
  // await page.fill("#username", process.env.DELIUS_USERNAME!);
  // await page.fill("#password", process.env.DELIUS_PASSWORD!);
  await page.fill("#username", "karuna.kanumuri");
  await page.fill("#password", "Windows*01*01");
  await page.click("#submit");
  await expect(page).toHaveTitle(/Manage people on probation/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Manage people on probation/i,
    }),
  ).toBeVisible({ timeout: 15000 });
};

export const loginIfNotAlready = async (page: Page) => {
  try {
    await login(page);
  } catch {
    const homePage = new HomePage(page);
    await homePage.assertOnPage();
  }
};
