import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";

export default class PartiallyEligiblePage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, /[^\s]+ is eligible to use online check ins as well as existing face-to-face contact/, crn, uuid);
    }

    async completePage() {
        await this.submit()
    }

}