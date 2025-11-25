import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../../page.ts"

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL
const datepickerQA = '#esupervision-X457081-98160fdb-3dfd-4603-b08b-fe2a49feb7f5-checkins-date';

export default class DateFrequencyPagePage extends MPopPage {
    datepickerQA: string;
    constructor(page: Page) {
        super(page)
    }

    async goTo(crn: string){
        await this.page.goto(`${MPOP_URL}/case/${crn}/check-in/date-frequency/`)
    }

    async checkOnPage(){
        await this.checkQA("online-checkin-btn", "Set up online check ins");
    }

    async checkElementExists(qa: string){
        await this.checkQAExists(datepickerQA);
    }

    async clickSetupOnlineCheckInsBtn() {
        const btn = this.getQA("online-checkin-btn")
        await expect(btn).toBeVisible({ timeout: 10000 })  // ensure visible
        await btn.click()
    }

    async useTomorrowsDate(){
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Format date as DD/MM/YYYY (adjust if your datepicker expects another format)
        const day = String(tomorrow.getDate()).padStart(2, '0');
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = tomorrow.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Fill the input
        await this.page.fill(datepickerQA, formattedDate);

        // Trigger blur/change events if needed
        await this.page.keyboard.press('Tab');

        // Optional: pause to see the result
        await this.page.waitForTimeout(3000);

    }

}