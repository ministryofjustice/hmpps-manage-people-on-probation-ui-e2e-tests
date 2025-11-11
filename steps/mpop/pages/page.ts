import { expect, Locator, Page } from "@playwright/test"

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
        await this.checkQA("pageHeading", this.title)
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

    async checkHref(name: string, value: string){
        await expect(this.page.getByRole('link', {name: name})).toHaveAttribute('href', value)
    }

    async clickBackLink(){
        await this.page.getByRole('link', {name: 'Back'}).click()
    }

    async checkQA(qa: string, value: string){
        await expect(this.page.locator(`[data-qa="${qa}"]`)).toContainText(value)
    }

    async tableLink(tableqa: string, cellqa: string){
        await this.page.locator(`[data-qa="${tableqa}"]`).locator(`[data-qa="${cellqa}"]`).getByRole('link').click()
    }

    async sortByColumn(tableqa: string, cellqa: string, ascending: boolean){
        const currentSort = await this.page.locator(`[data-qa="${tableqa}"]`).locator(`[data-qa="${cellqa}"]`).getAttribute('aria-sort')
        const button = await this.page.locator(`[data-qa="${tableqa}"]`).locator(`[data-qa="${cellqa}"]`).getByRole('button')
        if (currentSort === "none"){
            await button.click()
            if (!ascending){
                await button.click()
            }
        } else if (currentSort == "ascending"){
            if (!ascending){
                await button.click()
            }
        } else {
            if (ascending){
                await button.click()
            }
        }
    }

    async pagination(id: number | string){
        if (id === "previous"){
            await this.page.getByRole("navigation", {name: "Previous"}).click()
        } else if (id == "next"){
            await this.page.getByRole("navigation", {name: "Next"}).click()
        } else {
            await this.page.getByRole("navigation", {name: `${id}`}).click()
        }
    }

    async clickSummaryAction(id: number, qa?: string){
        if (qa){
            await this.page.locator(`[data-qa="${qa}"]`).locator(`[class=govuk-summary-list__actions]`).nth(id).getByRole('link').click()
        } else {
            await this.page.locator(`[class=govuk-summary-list__actions]`).nth(id).getByRole('link').click()
        }
    }

    async checkSummaryRowKey(id: number, value: string){
        await expect(this.page.locator('[class="govuk-summary-list__key"]').nth(id)).toContainText(value)
    }

    async checkSummaryRowValue(id: number, value: string){
        await expect(this.page.locator('[class="govuk-summary-list__value"]').nth(id)).toContainText(value)
    }

    async checkEmptySummaryRowAction(id: number) {
        await expect(this.page.locator('[class="govuk-summary-list__row"]').nth(id)).not.toContainClass("govuk-summary-list__actions")
    }

    async checkForError(value: string) {
        await expect(this.page.locator('[data-qa="errorList"]')).toContainText(value)
    }
}