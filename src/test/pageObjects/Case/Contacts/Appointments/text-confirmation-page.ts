import { Page } from "@playwright/test";
import ContactPage from "../contactpage";

export default class TextConfirmationPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Text message confirmation", crn, uuid)
    }

    async completePage(option: boolean, mobile: string = '') {
        await this.clickRadio("smsOptIn", option ? 0 : 1)
        await this.submit()
    }
}