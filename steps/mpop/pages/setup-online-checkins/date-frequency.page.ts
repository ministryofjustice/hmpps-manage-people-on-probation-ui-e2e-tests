import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page.ts"


dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

const DATEPICKER_QA = 'input.moj-js-datepicker-input';
const CHECK_IN_FREQUENCY_SECTION = 'checkInFrequency';

export default class DateFrequencyPage extends MPopPage {
    datepickerQA: string;
    checkInFrequencySection: string;
    constructor(page: Page) {
        super(page);
        this.datepickerQA = DATEPICKER_QA;
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

    async selectOption4Weeks(){
        await this.clickRadio("checkInFrequency", 2)
        await this.submit()
    }

    async selectOption8Weeks(){
        await this.clickRadio("checkInFrequency", 3)
        await this.submit()
    }

    async selectOption2Weeks() {
        // Select the 2nd radio button (index 1)
        const radioButton = this.page.locator('input[type="radio"][name$="[checkins][interval]"]').nth(1);
        await radioButton.check();

        const id = await radioButton.getAttribute('id');

        // Get the label text associated with this input
        const labelText = await this.page.locator(`label[for="${id}"]`).innerText();

        await this.submit();

        // Return the label text (trimmed)
        return labelText.trim(); // "Every 8 weeks"
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
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const year = tomorrow.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        await this.page.fill(this.datepickerQA, formattedDate);
        await this.page.keyboard.press('Tab');

        return formattedDate;
    }

    async updateToNextWeekDate() {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const day = nextWeek.getDate(); // no leading zero
        const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
        const year = nextWeek.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        const monthName = nextWeek.toLocaleString('en-GB', {month: 'long'})
        const summaryFormattedDate = `${day} ${monthName} ${year}`;

        await this.page.fill(this.datepickerQA, formattedDate);
        await this.page.keyboard.press('Tab');

        return {
            inputFormat: formattedDate,
            summaryFormat: summaryFormattedDate
        };
    }

}