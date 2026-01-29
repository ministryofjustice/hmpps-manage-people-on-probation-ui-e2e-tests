import { Page } from "@playwright/test";
import ContactPage from "../../contactpage";

export default class ConfirmationPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, undefined, crn, uuid);
    }

    async checkWhatHappensNextTextExists() {
        await this.getQA("what-happens-next").isVisible()
    }

    async checkGoToAllCasesLinkExists(){
        await this.getLink("Go to the cases").isVisible()
    }

    async selectGoToAllCasesLink(){
        await this.getLink("Go to the cases").click()
    }
}