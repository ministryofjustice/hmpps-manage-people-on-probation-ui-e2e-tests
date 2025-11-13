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

    getQA(qa: string, locator: Locator|Page=this.page){
        return locator.locator(`[data-qa="${qa}"]`)
    }

    async clickRadio(qa: string, id: number){
        await this.getQA(qa).getByRole('radio').nth(id).click()
    }

    async submit(){
        await this.getQA("submit-btn").click()
    }

    getLink(name: string, locator: Locator|Page=this.page){
        return locator.getByRole('link', {name: name})
    }

    async clickLink(name: string){
        await this.getLink(name).click()
    }

    async clickBackLink(){
        await this.getLink("back").click()
    }

    async checkHref(name: string, value: string){
        await expect(this.getLink(name)).toHaveAttribute('href', value)
    }

    async checkQA(qa: string, value: string){
        await expect(this.getQA(qa)).toContainText(value)
    }

    async clickTableLink(tableqa: string, cellqa: string){
        await this.getQA(cellqa, this.getQA(tableqa)).getByRole("link").click()
    }

    async sortByColumn(tableqa: string, cellqa: string, ascending: boolean){
        const cell = this.getQA(cellqa, this.getQA(tableqa))
        const currentSort = await cell.getAttribute('aria-sort')
        const button = await cell.getByRole('button')
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

    getNavigation(name: string, locator: Locator|Page=this.page){
        return locator.getByRole('navigation', {name: name})
    }

    async pagination(id: number | string){
        if (id === "previous"){
            await this.getNavigation("Previous").click()
        } else if (id == "next"){
            await this.getNavigation("Next").click()
        } else {
            await this.getNavigation(`${id}`).click()
        }
    }

    async clickSummaryAction(id: number, qa?: string){
        if (qa){
            await this.page.locator(`[data-qa="${qa}"]`).locator(`[class=govuk-summary-list__actions]`).nth(id).getByRole('link').click()
        } else {
            await this.page.locator(`[class=govuk-summary-list__actions]`).nth(id).getByRole('link').click()
        }
    }

    getClass(cssClass: string, locator: Locator|Page=this.page){
        return locator.locator(`[class="${cssClass}"]`)
    }

    async checkSummaryRowKey(id: number, value: string){
        await expect(this.getClass("govuk-summary-list__key").nth(id)).toContainText(value)
    }

    async checkSummaryRowValue(id: number, value: string){
        await expect(this.getClass("govuk-summary-list__value").nth(id)).toContainText(value)
    }

    async checkEmptySummaryRowAction(id: number) {
        await expect(this.getClass("govuk-summary-list__row").nth(id)).not.toContainClass("govuk-summary-list__actions")
    }

    async checkForError(value: string) {
        await expect(this.getQA("errorList")).toContainText(value)
    }
}