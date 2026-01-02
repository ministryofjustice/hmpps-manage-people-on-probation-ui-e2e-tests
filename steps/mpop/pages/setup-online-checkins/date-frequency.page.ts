import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page.ts"
import CheckInSummaryPage from "./check-in-summary.page.ts";


dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

const DATEPICKER_QA = 'input.moj-js-datepicker-input';
const DATEPICKER_ICON = 'moj-datepicker-icon';
const CHECK_IN_FREQUENCY_SECTION = 'checkInFrequency';

export default class DateFrequencyPage extends MPopPage {
    checkInSummaryPage: CheckInSummaryPage;
    datepickerQA: string;
    datePickerIcon: string;
    checkInFrequencySection: string;
    constructor(page: Page) {
        super(page);
        this.checkInSummaryPage = new CheckInSummaryPage(page);
        this.datepickerQA = DATEPICKER_QA;
        this.datePickerIcon = DATEPICKER_ICON;
        this.checkInFrequencySection = CHECK_IN_FREQUENCY_SECTION;
    }

    async goTo(crn: string){
        await this.page.goto(`${MPOP_URL}/case/${crn}/appointments\\/[0-9a-fA-F-]{36}\\/check-in\\/date-frequency/`)
    }

    async checkOnPage(){
        await this.checkQAExists(this.checkInFrequencySection)
    }

    async checkElementExists (){
        await this.checkQAExists(this.datepickerQA);
    }


    async selectOption8Weeks(){
        await this.clickRadio("checkInFrequency", 3)
        await this.submit()
    }


    async selectOption2Weeks() {

        await this.page.waitForURL(/\/check-in\/date-frequency/, { timeout: 20000 });
        await this.page.waitForTimeout(3000);
        // Wait for the container to appear
        const container = this.page.locator('[data-qa="checkInFrequency"]');
        await expect(container).toBeVisible({ timeout: 20000 });

        const radios = container.locator('input[type="radio"]');
        await expect(radios).toBeVisible({ timeout: 10000 });

        const radioButton = radios.nth(1);

        // Ensure the radio is visible and enabled
        await expect(radioButton).toBeVisible({ timeout: 10000 });
        await expect(radioButton).toBeEnabled({ timeout: 10000 });
        await radioButton.click()

        const id = await radioButton.getAttribute('id');
        const labelText = await this.page.locator(`label[for="${id}"]`).innerText();

        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }),
            this.submit()
        ]);

        return labelText.trim();
    }


    async clickSetupOnlineCheckInsBtn() {
        const btn = this.getQA("online-checkin-btn")
        await expect(btn).toBeVisible({ timeout: 10000 })  // ensure visible
        await btn.click()
    }


    async useTomorrowsDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const day = tomorrow.getDate(); // already no leading zero
        //const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const month = tomorrow.getMonth() + 1;
        const year = tomorrow.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        await this.page.fill(this.datepickerQA, formattedDate);
        await this.page.keyboard.press('Tab');

        return formattedDate;
    }

    async updateToNextWeekDate() {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const day = nextWeek.getDate();
        const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
        const year = nextWeek.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        const monthName = nextWeek.toLocaleString('en-GB', { month: 'long' });
        const summaryFormattedDate = `${day} ${monthName} ${year}`;

        const dateInput = this.page.locator(this.datepickerQA);
        await dateInput.waitFor({ state: 'visible', timeout: 10000 });
        await dateInput.fill(''); // clear existing value
        await dateInput.fill(formattedDate); // fill new value
        await dateInput.press('Tab'); // trigger JS events

        // Optional: verify the input
        const value = await dateInput.inputValue();
        if (value !== formattedDate) {
            throw new Error(`Date input failed. Expected: ${formattedDate}, got: ${value}`);
        }

        return { inputFormat: formattedDate, summaryFormat: summaryFormattedDate };
    }


}