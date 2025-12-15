import {expect, Locator, Page} from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page.ts"

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL


export default class ContactPreferencePage extends MPopPage {

    constructor(page: Page) {
        super(page)
    }

    async goTo(crn: string) {
        await this.page.goto(`${MPOP_URL}/case/${crn}/appointments\\/[0-9a-fA-F-]{36}\\/check-in/contact-preference/`)
    }
    async assertMobileNumberExists(expectedNumber: string) {
        const numberLocator = this.getQA("mobileNumberValue");
        await expect(numberLocator).toBeVisible();
        await expect(numberLocator).toHaveText(expectedNumber);
    }

    async enterContactPreferenceIfDoesNotExists(
        value: string,
        contactMethod: 'text' | 'email' | 'textUpdate'| 'emailUpdate'
    ) {
        let radioValue: string;
        let valueLocator: string;
        let changeLinkSelector: string;
        let inputLocator: Locator;

        switch (contactMethod) {
            case 'text':
            case 'textUpdate':
                radioValue = 'TEXT';
                valueLocator = '[data-qa="mobileNumberValue"]';
                changeLinkSelector = '[data-qa="mobileNumberAction"]';
                inputLocator = this.page.locator('input[id$="checkins-editCheckInMobile"]');
                break;

            case 'email':
            case 'emailUpdate':
                radioValue = 'EMAIL';
                valueLocator = '[data-qa="emailAddressValue"]';
                changeLinkSelector = '[data-qa="emailAddressAction"]';
                inputLocator = this.page.locator('input[aria-describedby$="editCheckInEmail-hint"]');
                break;

            default:
                throw new Error(`Invalid contact method used: ${contactMethod}`);
        }

        //  Select the radio button
        await this.page.locator(`input[type="radio"][value="${radioValue}"]`).check();

        // Get the current TEXT or EMAIL value
        const currentValueText = await this.page.locator(valueLocator).textContent();

        // If it already exists -- do nothing and Continue further
        if (currentValueText && !currentValueText.includes("No") &&
            contactMethod !== "textUpdate" &&
            contactMethod !== "emailUpdate"){
            await this.continueButton()
            return radioValue;
        }

        // - If Mobile number or Email does not exist then select the Change link based on the preference option selected
        await Promise.all([
            this.page.locator(changeLinkSelector).click(),
            this.checkPageHeader("pageHeading", /Edit contact details for .*/i)
        ]);

        //  Fill the correct input field (mobile or email)
        await expect(inputLocator).toBeVisible();
        await expect(inputLocator).toBeEditable();
        await inputLocator.fill(value);

        //  Save changes and navigate to the previous page
        await this.submit()


        // Validate and return to the previous page
        await this.checkPageHeader("pageHeading", "Contact Preferences");

        // Verify the inputted value: Mobile number or Email
        await expect(this.page.locator(valueLocator)).toHaveText(value);

        return radioValue;
    }

}