import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";

export default class InstructionsPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "How you can use online check ins", crn, uuid);
    }

    async completePage() {
        await this.submit()
    }

}