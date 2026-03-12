import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";

export default class EligiblePage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, /[^\s]+ is eligible to use online check ins/, crn, uuid);
    }

    async completePage(id: number) {
        await this.clickRadio('eligibility-options', id)
        await this.submit()
    }

}