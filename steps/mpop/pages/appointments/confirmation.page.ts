import { expect, Page } from "@playwright/test";
import MPopPage from "../page";

export default class ConfirmationPage extends MPopPage {
    constructor(page: Page) {
        super(page, 'Appointment arranged')
    }

    async completePage(option: string) {
        if (option === "createAnother"){
            await this.clickLink('arrange another appointment')
        } else if (option === "returnToAll") {
            await this.clickLink('Return to all cases')
        } else {
            await this.submit()
        }
    }
}