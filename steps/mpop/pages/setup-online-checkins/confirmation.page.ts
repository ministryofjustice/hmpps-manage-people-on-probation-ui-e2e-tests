import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page.ts"
import path from "node:path";

import {photo_1_path} from "../../../test-data.ts";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL




export default class ConfirmationPage extends MPopPage {
    constructor(page: Page) {
        super(page);
    }

    // async goTo(crn: string) {
    //     await this.page.goto(`${MPOP_URL}/case/${crn}/appointments\\/[0-9a-fA-F-]{36}\\/check-in\\/photo-options/`)
    // }

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