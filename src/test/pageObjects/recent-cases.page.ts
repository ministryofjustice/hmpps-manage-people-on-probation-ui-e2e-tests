import { expect, Page } from "@playwright/test";
import MPopPage from "./page";
import { MPOP_URL } from "../util/Data";

export default class RecentCasesPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Recently viewed cases")
    }

    async goTo(){
       await this.page.goto(`${MPOP_URL}/recent-cases`)
    }

    async checkNoRecentCases(){
        await expect(this.getClass('govuk-grid-column-full').getByText('You do not have any recently viewed cases')).toBeVisible()
    }

    async checkRecentCases(cases:string[]){
        const recentCasesText = await this.page.getByRole('link', {name: /,/}).allTextContents()
        const recentCases = recentCasesText.map(i => i.trim())
        expect(recentCases).toEqual(cases.reverse())
    }
}