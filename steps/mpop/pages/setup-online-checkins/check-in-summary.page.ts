import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page.ts"
import path from "node:path";

import {photo_1_path} from "../../../test-data.ts";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL




export default class CheckInSummaryPage extends MPopPage {
    constructor(page: Page) {
        super(page);
    }

    async goTo(crn: string){
        await this.page.goto(`${MPOP_URL}/case/${crn}/appointments\\/[0-9a-fA-F-]{36}\\/check-in\\/photo-options/`)
    }

    async selectTakeAPhotoNowUsingLaptop(){
        await this.clickRadio("uploadOptions", 0)
        await this.submit()
    }

    async selectUploadAPhoto(){
        await this.clickRadio("uploadOptions", 1)
        await this.submit()
    }

    private readonly dateActionChangeLink = "dateAction"
    private readonly dateIntervalActionChangeLink = "intervalAction"
    private readonly preferredCommsActionChangeLink = "preferredComsAction"
    private readonly mobileActionChangeLink = "checkInMobileAction"
    private readonly emailActionChangeLink = "checkInEmailAction"
    private readonly takeAPhotoActionChangeLink = "photoUploadOptionAction"
    private readonly photoActionChangeLink = "photoAction"

    // async clickChangeLinkByQA(qa: string) {
    //     await this.page.locator(`[data-qa="${qa}"]`).click();
    // }

    async clickDateChangeLink() {
        //await this.clickChangeLinkByQA(this.dateActionChangeLink);
        await this.getQA(this.dateActionChangeLink).click();
    }

    async clickDateIntervalChangeLink() {
        await this.getQA(this.dateIntervalActionChangeLink).click();
    }

    async clickPreferredCommsActionChangeLink() {
        await this.getQA(this.preferredCommsActionChangeLink).click();
    }

    async clickMobileActionChangeLink() {
        await this.getQA(this.mobileActionChangeLink).click();
    }

    async clickEmailActionChangeLink() {
        await this.getQA(this.emailActionChangeLink).click()
    }

    async clickTakeAPhotoActionChangeLink() {
        await this.getQA(this.takeAPhotoActionChangeLink).click();
    }

    async clickPhotoActionChangeLink() {
        await this.getQA(this.photoActionChangeLink).click();
    }

    async verifyDateInSummary(expectedDate: string) {
            // Locate the row where the dt (label) matches the question
            const row = this.page.locator('.govuk-summary-list__row', {
                hasText: /When would you like/i
            });

            // Within that row, find the value <dd>
            const dateValue = row.locator('.govuk-summary-list__value');

            // Assert it matches expected
            await expect(dateValue).toHaveText(expectedDate);
    }

    async verifyDateFrequencyInSummary(expectedDate: string) {
        // Locate the row where the dt (label) matches the question
        const row = this.page.locator('.govuk-summary-list__row', {
            hasText: /How often would you like/i
        });

        // Within that row, find the value <dd>
        const dateValue = row.locator('.govuk-summary-list__value');

        // Assert it matches expected
        await expect(dateValue).toHaveText(expectedDate);
    }

    async verifySummaryField(field: 'date' | 'firstCheckIn' |'frequency' | 'preferredCommunication' | 'mobile' | 'email' | 'uploadPhoto', expectedValue: string) {
        let labelPattern: RegExp;

        switch (field) {
            case 'date':
            case 'firstCheckIn':
                labelPattern = /When would you like|First check in/i;
                break;
            case 'frequency':
                labelPattern = /How often would you like/i;
                break;
            case 'preferredCommunication':
                labelPattern = /How does/i;
                if (expectedValue.toUpperCase() === 'TEXT') expectedValue = 'Text message';
                if (expectedValue.toUpperCase() === 'EMAIL') expectedValue = 'Email';
                break;
            case 'mobile':
                labelPattern = /Mobile number/i;
                break;
            case 'email':
                labelPattern = /Email address/i;
                break;
            case 'uploadPhoto':
                labelPattern = /How do you want to take a photo of/i;
                break;

            default:
                throw new Error(`Unknown summary field: ${field}`);
        }

        // Locate the row by dt text
        const row = this.page.locator('.govuk-summary-list__row', { hasText: labelPattern });

        // Locate the corresponding <dd> value
        const value = row.locator('.govuk-summary-list__value');

        // Assert it matches expected
        await expect(value).toHaveText(expectedValue);
       // await expect(value).toHaveText(new RegExp(`\\s*${expectedValue.trim()}\\s*`, 'i'));
    }


}