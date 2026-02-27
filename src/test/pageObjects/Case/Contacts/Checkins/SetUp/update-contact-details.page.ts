import { Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { ContactDetails } from "../../../../../features/Fixtures";

export default class ContactDetailsPage extends ContactPage {

    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Edit contact details for", crn, uuid)
    }

    async completePage(contacts: ContactDetails){
        if (contacts.phone){
            await this.fillText('phoneNumber', contacts.phone)
        }
        if (contacts.mobile){
            await this.fillText('mobileNumber', contacts.mobile)
        }
        if (contacts.email){
            await this.fillText('emailAddress', contacts.email)
        }
        try {
            await this.continueButton();
        } catch {
            await this.submit()
        }
    }
}