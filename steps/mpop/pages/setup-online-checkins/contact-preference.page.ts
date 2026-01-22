import {expect, Locator, Page} from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page"

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL


export default class ContactPreferencePage extends MPopPage {

    constructor(page: Page) {
        super(page)
    }

    // async enterContactPreferenceIfDoesNotExists(
    //     value: string,
    //     contactMethod: 'Text message' | 'email' | 'textUpdate'| 'emailUpdate'
    // ) {
    //     let radioValue: string;
    //     let valueLocator: string;
    //     let changeLinkSelector: string;
    //     let inputLocator: Locator;
    //
    //     switch (contactMethod) {
    //         case 'Text message':
    //         case 'textUpdate':
    //             radioValue = 'PHONE';
    //             valueLocator ='[data-qa="mobileNumberValue"]';
    //             changeLinkSelector = '[data-qa="mobileNumberAction"]';
    //             inputLocator = this.page.locator('input[id$="editCheckInMobile"]');
    //             break;
    //
    //         case 'email':
    //             radioValue = 'EMAIL';
    //             //valueLocator = '[data-qa="emailAddressValue"]';
    //             valueLocator = 'xpath=//span[@data-qa="emailAddressValue"]/parent::*';
    //             changeLinkSelector = '[data-qa="emailAddressAction"]';
    //             inputLocator = this.page.locator('input[aria-describedby$="editCheckInEmail-hint"]');
    //             break;
    //         case 'emailUpdate':
    //             radioValue = 'EMAIL';
    //             valueLocator = '//span[@data-qa="emailAddressValue"]/parent::*';
    //             changeLinkSelector = '[data-qa="emailAddressAction"]';
    //             inputLocator = this.page.locator('input[aria-describedby$="editCheckInEmail-hint"]');
    //             break;
    //
    //         default:
    //             throw new Error(`Invalid contact method used: ${contactMethod}`);
    //     }
    //
    //     //  Select the radio button
    //     await this.page.locator(`input[type="radio"][value="${radioValue}"]`).isEnabled();
    //     await this.page.locator(`input[type="radio"][value="${radioValue}"]`).check();
    //
    //     // Get the current TEXT or EMAIL value
    //     const currentValueText = await this.page.locator(valueLocator).textContent();
    //
    //     // If it already exists -- do nothing and Continue further
    //     if (currentValueText && !currentValueText.includes("No") &&
    //         contactMethod !== "textUpdate" &&
    //         contactMethod !== "emailUpdate"){
    //         await this.continueButton()
    //         return radioValue;
    //     }
    //
    //     // - If Mobile number or Email does not exist then select the Change link based on the preference option selected
    //     await this.page.locator(changeLinkSelector).isEnabled();
    //     await this.page.locator(changeLinkSelector).click();
    //
    //     //  Fill the correct input field (mobile or email)
    //     await inputLocator.waitFor({ state: 'visible' });
    //     await inputLocator.click();
    //     await inputLocator.fill(value);
    //
    //     //  Save changes and navigate to the previous page
    //     await this.submit()
    //
    //     // Validate and return to the previous page
    //     await this.checkPageHeader("pageHeading", "Contact preferences");
    //
    //     // Verify the inputted value: Mobile number or Email
    //     await expect(this.page.locator(valueLocator)).toHaveText(value);
    //
    //     return radioValue;
    // }
    async enterContactPreferenceIfDoesNotExists(
        value: string,
        contactMethod: 'Text message' | 'email' | 'textUpdate'| 'emailUpdate'
    ): Promise<{ radioValue: string, alreadyContinued: boolean }> {

        let radioValue: string;
        let valueLocator: string;
        let changeLinkSelector: string;
        let inputLocator: Locator;

        switch (contactMethod) {
            case 'Text message':
            case 'textUpdate':
                radioValue = 'PHONE';
                valueLocator ='[data-qa="mobileNumberValue"]';
                changeLinkSelector = '[data-qa="mobileNumberAction"]';
                inputLocator = this.page.locator('input[id$="editCheckInMobile"]');
                break;

            case 'email':
            case 'emailUpdate':
                radioValue = 'EMAIL';
                valueLocator = 'xpath=//span[@data-qa="emailAddressValue"]/parent::*';
                changeLinkSelector = '[data-qa="emailAddressAction"]';
                inputLocator = this.page.locator('input[aria-describedby$="editCheckInEmail-hint"]');
                break;

            default:
                throw new Error(`Invalid contact method used: ${contactMethod}`);
        }

        // Select the radio button
        await this.page.locator(`input[type="radio"][value="${radioValue}"]`).check();

        // Get the current TEXT or EMAIL value
        const currentValueText = await this.page.locator(valueLocator).textContent();

        // If value exists and doesn't need updating
        if (currentValueText && !currentValueText.includes("No") &&
            contactMethod !== "textUpdate" &&
            contactMethod !== "emailUpdate") {
            await this.continueButton();
            return { radioValue, alreadyContinued: true }; // <--- flag
        }

        // Value doesn't exist → click change
        await this.page.locator(changeLinkSelector).click();

        // Fill input
        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.fill(value);

        // Submit changes
        await this.submit();

        // Validate previous page
        await this.checkPageHeader("pageHeading", "Contact preferences");

        // Verify inputted value
        await expect(this.page.locator(valueLocator)).toHaveText(value);

        return { radioValue, alreadyContinued: false };
    }

}