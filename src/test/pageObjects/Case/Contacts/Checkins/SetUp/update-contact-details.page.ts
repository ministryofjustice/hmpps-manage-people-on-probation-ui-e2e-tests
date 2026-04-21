import { Page } from "@playwright/test";
import ContactPage from "../../Contacts/contact.page";
import { ContactDetails } from "../../../../../features/Fixtures";

export default class ContactDetailsPage extends ContactPage {

    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Edit contact details for", crn, uuid)
    }

    async completePage(contacts: ContactDetails){
        if (contacts.phone != undefined){
            await this.fillText('phoneNumber', contacts.phone)
        }
        if (contacts.mobile != undefined){
            await this.fillText('mobileNumber', contacts.mobile)
        }
        if (contacts.email != undefined){
            try {
                await this.fillText('emailAddress', contacts.email)
            } catch {
                await this.fillText('editEmail', contacts.email)
            }
        }
        try {
            await this.getQA('submitBtn').click()
        } catch {
            await this.submit()
        }
       
    }
}