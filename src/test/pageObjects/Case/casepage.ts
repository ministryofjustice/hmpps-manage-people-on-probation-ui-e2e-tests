import { expect, Page } from "@playwright/test";
import MPopPage from "../page";

export default abstract class CasePage extends MPopPage {
    readonly crn?: string

    protected constructor(page: Page, title?: string | RegExp, crn?: string) {
        super(page, title)
        this.crn = crn
    }

    async assertOnPage(allowRestricted:boolean=true){
        await this.page.waitForLoadState('networkidle')
        const onPage = await this.checkOnPage()
        if (!onPage && allowRestricted){
            const restricted = await this.isRestricted()
            if (restricted){
                await this.clickBackLink()
                return
            }
        }
        expect(onPage).toBeTruthy()
    }

    async isRestricted(): Promise<boolean>{
        try {
            await expect(this.getClass("govuk-heading-l")).toContainText("You are restricted from viewing this case")
            return true
        } catch {
            return false
        }
    }

    async useBreadcrumbs(id: number) { //0 returns to cases, 1 returns to overview
        await this.getClass('govuk-breadcrumbs').getByRole('link').nth(id).click()
    }

    async checkCrn(crn?: string){
        await this.checkQA('crn', (crn ?? this.crn)!)
    }

    async checkPopHeader(crn?: string){
        const checkCrn = (crn ?? this.crn)!
        await this.checkQA('crn', checkCrn)
    }
}