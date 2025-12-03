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

    async getTableLength(tableqa: string): Promise<number> {
        const rows = await this.getClass("govuk-table__row", this.getQA(tableqa)).all()
        return rows.length
    }

    getNavigation(name: string){
        return this.getClass("govuk-pagination").getByRole('link', {name: name})
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

    async checkForError(value: string) {
        await expect(this.getQA("errorList")).toContainText(value)
    }

    async getSummaryRowByID(id: number): Promise<Locator> {
        return this.getClass("govuk-summary-list__row").nth(id)
    }

    async getSummaryRowByKey(key: string): Promise<Locator> {
        const rows = await this.getClass("govuk-summary-list__key", this.getClass("govuk-summary-list__row")).allTextContents()
        const index = rows.indexOf(rows.find(element => (element.includes(key))))
        if (index != -1){
            return this.getClass("govuk-summary-list__row").nth(index)
        }
        return undefined
    }

    async checkSummaryRowValue(row: Locator, value: string|RegExp){
        await expect(this.getClass("govuk-summary-list__value", row)).toContainText(value)
    }

    async checkSummaryRowKey(row: Locator, value: string){
        await expect(this.getClass("govuk-summary-list__key", row)).toContainText(value)
    }

    async selectOption(qa: string, option: string){
        await this.getQA(qa).selectOption(option)
    }

    async useSubNavigation(qa: string){
        await this.getQA(qa).getByRole('link').click()
    }

    async usePrimaryNavigation(tab: string){
        await this.page.locator('[class="moj-primary-navigation"]').getByRole('link', {name: tab}).click()
    }

    async getAlertsCount() : Promise<number> {
        return parseInt((await (this.getClass("moj-notification-badge", this.getLink("Alerts"))).allTextContents())[0])
    }

    async logout() {
        await this.getQA('probation-common-header-user-name').click()
        await this.getLink('Sign out').click()
    }


}