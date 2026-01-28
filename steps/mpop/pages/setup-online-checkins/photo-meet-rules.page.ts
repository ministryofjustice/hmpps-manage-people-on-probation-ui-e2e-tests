import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page"


dotenv.config({ path: '.env' })

export default class PhotoMeetRulesPage extends MPopPage {
    constructor(page: Page) {
        super(page);
    }

    async checkPhotoRulesDisplayed() {
        await expect(this.page.locator('#main-content form ul')).toBeVisible();
    }
}