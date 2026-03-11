import { expect, Page } from "@playwright/test";
import ContactPage from "../contactpage";
import { navigateToCase } from "../../../../util/Navigation";
import OverviewPage from "../../overview.page";

export default class ManageCheckInsPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Online check ins", crn, uuid);
    }
    
    async navigateTo(crn?: string){
        await navigateToCase(this.page, (crn ?? this.crn)!)
        const overview = new OverviewPage(this.page)
        await overview.assertOnPage()
        await overview.checkOnlineCheckInsLink(false)
    }

    async clickStopCheckIns(){
        await this.getQA('stop-checkin-btn').click()
    }

    async clickRestartCheckIns(){
        await this.getQA('restart-checkin-btn').click()
    }
}