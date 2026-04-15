import {expect, Page} from "@playwright/test";
import ContactPage from "../contactpage";

export default class AttendedCompliedPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "What was the outcome of this appointment?", crn, uuid)
    }
    async completePage() {
      const radioButton = this.page.getByRole("radio", {name: 'Attended', exact: true});
        await expect(radioButton).toBeVisible();
        await radioButton.check();
        await expect(radioButton).toBeChecked();
        await this.submit();
    }
}