import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { caseNavigation, navigateToCase } from "../../util/Navigation";
import RemovedRiskFlagsPage from "./removed-risk-flags.page";
import RiskFlagPage from "./Contacts/Checkins/risk-flag.page";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class RiskPage extends CasePage {
    constructor(page: Page, crn?: string) {
        super(page, "Risk", crn)
    }

    async goTo(crn?: string){
       await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/risk/`)
    }

    async navigateTo(crn?: string){
        await caseNavigation(this.page, (crn ?? this.crn)!, "riskTab")
    }

    async checkRiskAssessment(){
        await this.getQA('noOasysRiskBanner').isVisible()
        //might need case for banner existing too
    }
    async checkRiskFlags(){
        await this.getQA('riskFlagsCard').isVisible()
    }
    async checkOPD(){
        await this.getQA('opd').isVisible()
    }
    async checkRoshWidget(){
        await this.getClass('rosh-widget').isVisible()
    }
    async checkMAPPA(){
        await this.getClass('mappa-widget').isVisible()
    }
    async checkOASysHistory(){
        await this.getQA('oasysScoreHistory').isVisible()
    }
    async checkSections(){
        await this.checkRiskAssessment()
        await this.checkRiskFlags()
        await this.checkOPD()
        await this.checkRoshWidget()
        await this.checkMAPPA()
        await this.checkOASysHistory()
    }

    async checkRemovedFlagsLink(){
        await this.getQA('riskFlagsCard').getByRole('link', {name: /View removed risk flags/}).click()
        const removedRiskFlagsPage = new RemovedRiskFlagsPage(this.page)
        await removedRiskFlagsPage.checkOnPage()
        await removedRiskFlagsPage.checkLinks()
        await removedRiskFlagsPage.useBreadcrumbs(2)
        await this.checkOnPage()
    }
    async checkRiskFlagLinks(){
        const links = await this.getClass('govuk-table govuk-!-margin-bottom-4', this.getQA('riskFlagsCard')).getByRole('link').count()
        for (let i=1; i<=links; i++){
            const link = this.getQA(`risk${i}DescriptionValue`).getByRole('link')
            const title = await link.textContent()
            await link.click()
            const riskFlag = new RiskFlagPage(this.page, title!)
            await riskFlag.checkOnPage()
            await riskFlag.useBreadcrumbs(2)
        }
    }
    async checkScoreHistory(){
        const count = await this.getClass('moj-timeline__item').count()
        for (let i=1; i<= count; i++){
            await this.getQA(`timeline-item-${i}`).getByRole('button').click()
            await this.getQA(`timeline-item-${i}`).getByRole('button').click()
        }
    }
    async checkLinks(){
        await this.checkRiskFlagLinks()
        await this.checkRemovedFlagsLink()
        await this.checkScoreHistory()
    }
}