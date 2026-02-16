import { Page } from "@playwright/test";
import MPopPage from "./page";

export default class LogOutcomesPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Outcomes to log")
    }

    async selectFirst(){
        await this.page.getByRole('link', {name: /^Manage$/i }).first().click()
    }
}