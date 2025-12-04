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

    async clickSetupOnlineCheckInsBtn() {
        const btn = this.getQA("online-checkin-btn")
        await expect(btn).toBeVisible({ timeout: 10000 })  // ensure visible
        await btn.click()
    }

    async useTomorrowsDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Day with optional leading zero removed
        let day = String(tomorrow.getDate()).padStart(2, '0');
        if (day.startsWith("0")) {
            day = day.substring(1);
        }

        // Month still padded (remove this if you also want to normalise month)
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');

        const year = tomorrow.getFullYear();

        // Final format, but DAY has no leading zero
        const formattedDate = `${day}/${month}/${year}`;

        await this.page.fill(this.datepickerQA, formattedDate);
        await this.page.keyboard.press('Tab');
    }


}