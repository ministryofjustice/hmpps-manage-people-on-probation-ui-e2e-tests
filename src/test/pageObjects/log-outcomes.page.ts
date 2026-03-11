import { expect, Page } from "@playwright/test";
import MPopPage from "./page";

export default class LogOutcomesPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Outcomes to log")
    }

    async selectFirst(id: number = 0){
        await this.page.getByRole('link', {name: /^Manage$/i }).nth(id).click()
    }

    async checkTop5(outcomes: string[]){
        const text = await this.getClass('moj-scrollable-pane').getByRole('link', {name: /,/}).allTextContents()
        const top5 = text.slice(0,5).map(i => i.trim())
        expect(outcomes).toEqual(top5)
    }
}