import { Page } from "@playwright/test";
import ContactPage from "../../contactpage";

export default class ReviewExpiredPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Online check in missed", crn, uuid);
    }

    async completePage(note: string) {
        await this.fillText('notes', note)
        await this.submit()
    }
}