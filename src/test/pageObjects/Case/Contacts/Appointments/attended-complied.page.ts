import { Page } from "@playwright/test";
import ContactPage from "../contactpage";

export default class AttendedCompliedPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "attended and complied", crn, uuid)
    }

    async completePage() {
        await this.page.getByRole("checkbox").check()
        await this.submit()
    }
}