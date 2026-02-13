import { Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { ContactDetails } from "../../../../../util/SetupOnlineCheckins";

export default class ContactDetailsPage extends ContactPage {

    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Edit contact details for", crn, uuid)
    }

    async completePage(contacts: ContactDetails){
        if (contacts.mobile){
            await this.page.locator('input[id$="editCheckInMobile"]').waitFor({ state: 'visible' });
            await this.page.locator('input[id$="editCheckInMobile"]').fill(contacts.mobile);
        }
        if (contacts.email){
            await this.page.locator('input[aria-describedby$="editCheckInEmail-hint"]').waitFor({ state: 'visible' });
            await this.page.locator('input[aria-describedby$="editCheckInEmail-hint"]').fill(contacts.email);
        }
        await this.submit();
    }
}