import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";

export default class IneligiblePage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, /[^\s]+ is not eligible to use online check ins/, crn, uuid);
    }

    async completePage() {
        await this.submit()
    }

}