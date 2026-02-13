import {expect, Locator, Page} from "@playwright/test";
import ContactPage from "../../contactpage";
import { ContactDetails } from "../../../../../util/SetupOnlineCheckins";
import ContactDetailsPage from "./update-contact-details.page";

export enum Preference {
    TEXT = 0,
    EMAIL = 1
}
export type contactMethod = 'Text message' | 'email' | 'textUpdate'| 'emailUpdate'

export default class ContactPreferencePage extends ContactPage {

    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Contact preferences", crn, uuid)
    }

    async completePage(
        values: ContactDetails,
        preference: Preference
    ){
        await this.changePage(values, preference)   
    }

    async changePage(
        values?: ContactDetails,
        preference?: Preference
    ){
        if (values?.email || values?.mobile){
            if (values.mobile){
                await this.getQA('mobileNumberAction').click();
            } else {
                await this.getQA('emailAddressAction').click();
            }
            const contactDetailsPage = new ContactDetailsPage(this.page)
            await contactDetailsPage.checkOnPage()
            await contactDetailsPage.completePage(values)
        }

        if (preference !== undefined){
            await this.clickRadio("checkInPreferredComs", preference)
        }
        await this.continueButton()        
    }

    async enterContactPreferenceIfDoesNotExists(
        value: string,
        contactMethod: 'Text message' | 'email' | 'textUpdate'| 'emailUpdate'
    ): Promise<{ radioValue: string }> {

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
        const radio = this.page.locator(`input[type="radio"][value="${radioValue}"]`);
        await radio.waitFor({ state: 'visible' }); 
        await radio.check();

        // Get the current TEXT or EMAIL value
        const valueEl = this.page.locator(valueLocator);
        await expect(valueEl).toBeVisible();

        const currentValueText = (await valueEl.textContent())?.trim();

        // If value exists and doesn't need updating
        if (currentValueText && !currentValueText.includes("No") &&
            contactMethod !== "textUpdate" &&
            contactMethod !== "emailUpdate") {
            await this.continueButton();
            return { radioValue }; // <--- flag
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

        if (!(await radio.isChecked())) {
            await radio.check();
        }

        // Verify inputted value
        await expect(valueEl).toHaveText(value);

        await this.continueButton();


        return { radioValue };
    }

}