import { expect, Page } from "@playwright/test";
import MPopPage from "../page";

export default abstract class CasePage extends MPopPage {
    readonly crn?: string

    protected constructor(page: Page, title?: string, crn?: string) {
        super(page, title)
        this.crn = crn
    }

    async checkOnPage(acceptWrong = false): Promise<boolean> {
        try {
            await this.checkQA("pageHeading", this.title ?? "")
            return true
        } catch {
            if (acceptWrong){
                try {
                    await expect(this.getClass("govuk-heading-l")).toContainText("You are restricted from viewing this case")
                    console.log("restricted")
                    await this.clickBackLink()
                    return false
                } catch {
                    console.log("on unexpected page")
                    return false
                }
            } else {
                await expect(this.getClass("govuk-heading-l")).toContainText("You are restricted from viewing this case")
                console.log("restricted")
                await this.clickBackLink()
                return false
            }
        }
    }

    async useBreadcrumbs(id: number) { //0 returns to cases, 1 returns to overview
        await this.getClass('govuk-breadcrumbs').getByRole('link').nth(id).click()
    }

    async checkCrn(crn?: string){
        await this.checkQA('crn', (crn ?? this.crn)!)
    }
}