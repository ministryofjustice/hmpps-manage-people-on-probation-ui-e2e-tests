import { expect, Locator, Page } from "@playwright/test"

export default abstract class MPopPage {
    readonly page: Page
    readonly title?: string

    protected constructor(page: Page, title?: string) {
        this.page = page
        this.title = title
    }

    async checkOnPage() {
        await this.checkQA("pageHeading", this.title ?? "")
    }

    async checkPageHeader(qa: string, expectedText: string | RegExp, timeout = 20000) {
        await this.page.waitForLoadState('domcontentloaded', { timeout });
        const locator = this.page.locator(`[data-qa="${qa}"]`);

        await expect(locator).toBeVisible({ timeout: 120000 });

        const text = (await locator.textContent())
            ?.replace(/\s+/g, ' ')
            .trim() || '';

        console.log(`Page header [${qa}]:`, text);

        // Assert manually for regex or string
        if (expectedText instanceof RegExp) {
            if (!expectedText.test(text)) {
                throw new Error(`Header text did not match expected pattern. Found: "${text}"`);
            }
        } else {
            if (text !== expectedText) {
                throw new Error(`Header text did not match expected string. Found: "${text}", Expected: "${expectedText}"`);
            }
        }
    }

    async returnToPoPsOverviewButtonExist(){
        await this.getQA("submit-btn").isVisible();
    }

    async selectPoPsOverviewButton() {
        await this.getQA("submit-btn").click();
    }

    getQA(qa: string, locator: Locator|Page=this.page){
        return locator.locator(`[data-qa="${qa}"]`)
    }

    async expectElementVisible(selector: string) {
        await expect(this.page.locator(selector)).toBeVisible();
    }

    async clickRadio(qa: string, id: number){
        await this.getQA(qa).getByRole('radio').nth(id).click()
    }

    // Safer clickRadio that works for radio buttons
    async NEW_clickRadio(qa: string, id: number) {
        const radio = this.getQA(qa).getByRole('radio').nth(id);

        // Ensure the radio button is visible
        await expect(radio).toBeVisible({ timeout: 10000 });

        // Use .check() for radio buttons (safer than click)
        await radio.check();

        // Optionally, you can verify it’s selected
        await expect(radio).toBeChecked({ timeout: 5000 });
    }

    async submit(){
        await this.getQA("submit-btn").click()
    }

    async continueButton(){
        await this.getQA("submitBtn").click()
    }

    getLink(name: string, locator: Locator|Page=this.page){
        return locator.getByRole('link', {name: name})
    }

    async clickLink(name: string){
        await this.getLink(name).click()
    }

    async clickChangeLink(name: string){
        await this.getQA(name).click()
    }


    async clickBackLink(){
        await this.getLink("back").click()
    }

    async checkHref(name: string, value: string){
        await expect(this.getLink(name)).toHaveAttribute('href', value)
    }

    async checkQA(qa: string, value: string | RegExp){
        await expect(this.getQA(qa)).toHaveText(value, {timeout: 10000})
    }

    async checkQAExists(qa: string) {
        const element = this.page.locator(qa)
        await expect(element).toBeVisible();
    }


    async checkPageHeaderPhoto(qa: string, expectedText: string) {
        const header = this.getQA(qa);
        await expect(header).toBeVisible();
        // Ensure we are no longer on the previous page
         await expect(header).not.toHaveText(/Contact preferences/);
        await expect(header).toContainText(expectedText, {timeout: 10000});
        //await expect(header).toHaveText(expectedText);
        const fullText = await header.innerText();

        // Normalize whitespace and remove the last word (the dynamic name)
        const staticPart = fullText
            .replace(/\s+/g, ' ')       // collapse whitespace
            .trim()
            .replace(/\s+\w+$/, '');    // remove the last word (e.g. "Teddy")

        expect(staticPart).toBe(expectedText);
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
        const index = rows.indexOf(rows.find(element => (element.includes(key))) ?? '')
        if (index != -1){
            return this.getClass("govuk-summary-list__row").nth(index)
        }
        return undefined!
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