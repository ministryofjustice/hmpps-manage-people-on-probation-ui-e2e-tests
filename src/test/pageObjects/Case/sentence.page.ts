import {expect, Page} from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import {caseNavigation, navigateToCase} from "../../util/Navigation";

dotenv.config({path: '.env'})
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class SentencePage extends CasePage {
    [x: string]: any;

    constructor(page: Page, crn?: string) {
        super(page, "Sentence", crn)
    }

    async goTo(crn?: string) {
        await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/sentence/`)
    }

    async navigateTo(crn?: string) {
        await caseNavigation(this.page, (crn ?? this.crn)!, "sentenceTab")
    }

    async checkPageHeading(heading: string) {
        await expect(this.getQA('pageHeading').first()).toContainText(heading)
    }


    async checkSentenceTitle(expectedTitle: string) {
        const actualTitle = await this.page.title()
        expect(actualTitle).toEqual(expectedTitle)
    }

    async checkProbationHistoryDetails() {
        const sentencePage = new SentencePage(this.page)
        await this.page.getByRole('link', {name: /Probation history/}).click()
        await this.page.waitForURL('**/probation-history')
        await expect(this.getQA('pageHeading').nth(1)).toContainText("Probation history")
        await expect(this.getQA('probationHistoryCard')).toContainText("Previous probation details")
        await expect(this.getQA('probationHistoryCard')).toContainText("Previous orders")
        await expect(this.getQA('probationHistoryCard')).toContainText("4 previous orders")
        await expect(this.getQA('probationHistoryCard')).toContainText("Previous breaches")
        await expect(this.getQA('probationHistoryCard')).toContainText("1 previous breach")
        await expect(this.getQA('probationHistoryCard')).toContainText("9 previous contacts")

        await sentencePage.useBreadcrumbs(2)
    }

    async checkLinks() {
        await this.checkProbationHistoryDetails()
    }


}