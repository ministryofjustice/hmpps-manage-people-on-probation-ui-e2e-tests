import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { MPOP_URL } from "../../../../../util/Data";

export default class CheckInSummaryPage extends ContactPage {

    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Check your answers before adding", crn, uuid);
    }

    async goTo(crn?: string, uuid?: string){
        await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/appointments/${(uuid ?? this.uuid)!}/check-in/photo-options/`)
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

    async clickDateChangeLink() {
        await this.getQA(this.dateActionChangeLink).isEnabled();
        await this.getQA(this.dateActionChangeLink).click();
        await this.page.locator('h2', { hasText: 'Set up online check ins' }).waitFor();
    }

    async clickDateIntervalChangeLink() {
        await this.getQA(this.dateIntervalActionChangeLink).isEnabled();
        await this.getQA(this.dateIntervalActionChangeLink).click();
    }

    async clickPreferredCommsActionChangeLink() {
        await this.getQA(this.preferredCommsActionChangeLink).isEnabled();
        await this.getQA(this.preferredCommsActionChangeLink).click();
    }

    async clickMobileActionChangeLink() {
        await this.getQA(this.mobileActionChangeLink).isEnabled();
        await this.getQA(this.mobileActionChangeLink).click();
    }

    async clickEmailActionChangeLink() {
        await this.getQA(this.emailActionChangeLink).isEnabled();
        await this.getQA(this.emailActionChangeLink).click();
    }

    async clickTakeAPhotoActionChangeLink() {
        await this.getQA(this.takeAPhotoActionChangeLink).isEnabled();
        await this.getQA(this.takeAPhotoActionChangeLink).click();
    }

    async clickPhotoActionChangeLink() {
        await this.getQA(this.photoActionChangeLink).isEnabled();
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

    async verifyCheckInDateInOverviewPage(summaryFormat: string) {
        // summaryFormat = "27/1/2026"
        const [day, month, year] = summaryFormat.split('/').map(Number);
        const dateObj = new Date(year, month - 1, day); // month is 0-based in JS

        const formattedDateOverviewPage = dateObj.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });

        // e.g. "Monday 27 January"
        return formattedDateOverviewPage;
    }

    async verifySummaryField(field: 'date' | 'firstCheckIn' |'frequency' | 'confirmedFrequency' | 'preferredCommunication' | 'mobile' | 'email' | 'uploadPhoto', expectedValue: string) {
        let labelPattern: RegExp;

        switch (field) {
            case 'date':
            case 'firstCheckIn':
                labelPattern = /When would you like|First check in/i;
                break;
            case 'frequency':
            case 'confirmedFrequency':
                labelPattern = /How often would you like|Frequency/i;
                break;
            case 'preferredCommunication':
                labelPattern = /How does|Contact preferences/i;
                if (expectedValue.toUpperCase() === 'PHONE') expectedValue = 'Text message';
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
        const Value = row.locator('.govuk-summary-list__value');

        // Assert it matches expected
        await expect(Value).toHaveText(expectedValue);
    }
}