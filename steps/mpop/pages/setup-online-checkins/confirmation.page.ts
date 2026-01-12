import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page"

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL




export default class ConfirmationPage extends MPopPage {
    constructor(page: Page) {
        super(page);
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