import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page"

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class SetupOnlineCheckinsPage extends MPopPage {
    constructor(page: Page) {
        super(page)
    }

    async goTo(crn: string){
        await this.page.goto(`${MPOP_URL}/case/${crn}/appointments/`)
    }

    async checkOnPage(){
        await this.checkQA("online-checkin-btn", "Set up online check ins");
    }

    async clickSetupOnlineCheckInsBtn() {
        const btn = this.getQA("online-checkin-btn")
        await expect(btn).toBeVisible({ timeout: 10000 })  // ensure visible
        await btn.click()
    }

}