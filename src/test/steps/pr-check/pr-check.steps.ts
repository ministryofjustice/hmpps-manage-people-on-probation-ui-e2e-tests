import {createBdd} from "playwright-bdd";
import { expect } from '@playwright/test';
import {testContext} from "../../features/Fixtures";

const { Given, When, Then } = createBdd(testContext);

Given('I navigate to the Playwright homepage', async ({ page }) => {
    await page.goto('https://playwright.dev/');
});

Then('the page title should contain {string}', async ({ page }, text: string) => {
    await expect(page).toHaveTitle(new RegExp(text));
});

When('I click the {string} link', async ({ page }, linkName: string) => {
    await page.getByRole('link', { name: linkName }).click();
});

Then('I should see a heading {string}', async ({ page }, heading: string) => {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
});