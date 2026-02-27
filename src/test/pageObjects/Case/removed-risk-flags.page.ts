import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { caseNavigation, navigateToCase } from "../../util/Navigation";
import RiskFlagPage from "./Contacts/Checkins/risk-flag.page";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class RemovedRiskFlagsPage extends CasePage {
    constructor(page: Page, crn?: string) {
        super(page, "Removed risk flags", crn)
    }

    async goTo(crn?: string){
       await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/risk/removed-risk-flags`)
    }

    async checkLinks(){
        const links = await this.getClass('govuk-table').getByRole('link').count()
        for (let i=1; i<=links; i++){
            const link = this.getQA(`removedRisk${i}Value`).getByRole('link')
            const title = await link.textContent()
            await link.click()
            const riskFlag = new RiskFlagPage(this.page, title!)
            await riskFlag.checkOnPage()
            await riskFlag.useBreadcrumbs(3)
        }
    }
}