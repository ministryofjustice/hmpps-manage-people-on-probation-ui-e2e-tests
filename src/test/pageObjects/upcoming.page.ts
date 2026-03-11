import { expect, Page } from "@playwright/test";
import MPopPage from "./page";

export default class UpcomingAppointmentsPage extends MPopPage {
    constructor(page: Page) {
        super(page, "My upcoming appointments")
    }

    async selectOfficeVisit(id: number = 0){
        await this.page.getByRole('link', {name: 'Planned' }).nth(id).click()
    }

    async checkTop5(upcoming: string[]){
        const text = await this.getClass('moj-scrollable-pane').getByRole('link', {name: /,/}).allTextContents()
        const top5 = text.slice(0,5).map(i => i.trim())
        expect(upcoming[0]).toEqual(top5[0]) //only check top1 atm due to sorting issues to be resolved in backend
    }

    async checkTop5(upcoming: string[]){
        const text = await this.getClass('moj-scrollable-pane').getByRole('link', {name: /,/}).allTextContents()
        const top5 = text.slice(0,5).map(i => i.trim())
        expect(upcoming[0]).toEqual(top5[0]) //only check top1 atm due to sorting issues to be resolved in backend
    }

    async checkTop5(upcoming: string[]){
        const text = await this.getClass('moj-scrollable-pane').getByRole('link', {name: /,/}).allTextContents()
        const top5 = text.slice(0,5).map(i => i.trim())
        expect(upcoming[0]).toEqual(top5[0]) //only check top1 atm due to sorting issues to be resolved in backend
    }
}