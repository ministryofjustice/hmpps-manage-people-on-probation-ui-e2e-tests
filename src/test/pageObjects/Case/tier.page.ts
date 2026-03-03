import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class TierPage extends CasePage {
    constructor(page: Page, crn?: string) {
        super(page, "", crn)
    }

    async checkOnPage(){
        await expect(this.getClass('govuk-heading-l').first()).toContainText('Summary')
    }

    async checkTier(tier: string){
        await expect(this.page.locator('p').first()).toContainText(`has a tier of ${tier}`)
    }

    async checkTierLink(){
        const link = this.getQA('tierLink')
        const tier = (await link.allTextContents())[0]
        await link.click()
        await this.checkOnPage()
        await this.checkTier(tier!)
        await this.useBreadcrumbs(1) //always return to case
    }
    
}