import { expect, Page } from "@playwright/test"

export default abstract class MPopPage {
    readonly page: Page
    readonly title?: string

    constructor(page: Page, title?: string) {
        this.page = page
        this.title = title
        if (this.title) {
            this.checkOnPage()
        }
    }

    async checkOnPage() {
        await expect(this.page.locator('[data-qa="pageHeading"]')).toContainText(this.title)
    }

    async clickRadio(qa: string, id: number){
        await this.page.locator(`[data-qa="${qa}"]`).getByRole('radio').nth(id).click()
    }

    async submit(){
        await this.page.locator('[data-qa="submit-btn"]').click()
    }

    async clickLink(name: string){
        await this.page.getByRole('link', {name: name}).click()
    }

    async clickBackLink(){
        await this.page.getByRole('link', {name: 'Back'}).click()
    }
}