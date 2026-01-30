import { expect, Page } from "@playwright/test"
import ContactPage from "../../contactpage";
import CheckInSummaryPage from "./check-in-summary.page";
import { MPOP_URL } from "../../../../../utilities/Data";
import { MpopDateTime } from "../../../../../utilities/DateTime";

const DATEPICKER_QA = 'input.moj-js-datepicker-input';
const DATEPICKER_ICON = 'moj-datepicker-icon';
const CHECK_IN_FREQUENCY_SECTION = 'checkInFrequency';

export enum FrequencyOptions {
  EVERY_WEEK = 0,
  EVERY_2_WEEKS = 1,
  EVERY_4_WEEKS = 2,
  EVERY_8_WEEKS = 3,
}


export default class DateFrequencyPage extends ContactPage {
    checkInSummaryPage: CheckInSummaryPage;
    datepickerQA: string;
    datePickerIcon: string;
    checkInFrequencySection: string;
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, 'Set up online check ins', crn, uuid);
        this.checkInSummaryPage = new CheckInSummaryPage(page);
        this.datepickerQA = DATEPICKER_QA;
        this.datePickerIcon = DATEPICKER_ICON;
        this.checkInFrequencySection = CHECK_IN_FREQUENCY_SECTION;
    }

    async goTo(crn?: string, uuid?: string){
        await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/appointments/${(uuid ?? this.uuid)!}/check-in/date-frequency/`)
    }

    async completePage(date: string, frequencyId: number) {
        await this.changePage(date, frequencyId)
    }

    async changePage(date?: string, frequencyId?: number) {
        if (date) {
            await this.getClass("moj-datepicker").locator('[type="text"]').fill(date)
        }
        if (frequencyId) {
            await this.clickRadio("checkInFrequency", frequencyId)
        }
        await this.submit()
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
            // Wait for the container to appear
            const container = this.page.locator('[data-qa="checkInFrequency"]');
            await expect(container).toBeEnabled();

            const radioButton = this.page.locator('input[type="radio"][value="TWO_WEEKS"]');
            await radioButton.isEnabled();
            await radioButton.check();

            const id = await radioButton.getAttribute('id');
            const labelText = await this.page.locator(`label[for="${id}"]`).innerText();

            await this.submit();

            return labelText.trim();
    }

    async selectOption4Weeks() {
        await this.page.waitForURL(/\/check-in\/date-frequency/, { timeout: 20000 });
        // Wait for the container to appear
        const container = this.page.locator('[data-qa="checkInFrequency"]');
        await expect(container).toBeEnabled();

        const radioButton = this.page.locator('input[type="radio"][value="FOUR_WEEKS"]');
        await radioButton.isEnabled();
        await radioButton.check();

        const id = await radioButton.getAttribute('id');
        const labelText = await this.page.locator(`label[for="${id}"]`).innerText();

        await this.submit();

        return labelText.trim();
    }


    async useTomorrowsDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const day = tomorrow.getDate(); // already no leading zero
        const month = String(tomorrow.getMonth() + 1);
        //const month = tomorrow.getMonth() + 1;
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

        const month = nextWeek.getMonth() + 1;
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