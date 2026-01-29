import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";

export default class PhotoMeetRulesPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, undefined, crn, uuid);
    }

    async checkPhotoRulesDisplayed() {
        await expect(this.page.locator('#main-content form ul')).toBeVisible();
    }
}