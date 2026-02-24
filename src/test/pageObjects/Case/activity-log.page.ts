import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { caseNavigation } from "../../util/Navigation";
import { ContactFilters } from "../../util/Contacts";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class ActivityLogPage extends CasePage {
    view : string = "default"

    constructor(page: Page, view: string = "default", crn?: string) {
        super(page, "Contacts", crn)
        this.view = view
    }

    async applyFilters(filters: ContactFilters){
        if (filters.keywords){
            await this.fillText('keywords', filters.keywords)
        }
        if (filters.from){
            await this.fillText('date-from', filters.from)
        }
        if (filters.to){
            await this.fillText('date-to', filters.to)
        }
        if ((filters.outcome && !await this.getFilter(0).isChecked()) || (!filters.outcome && await this.getFilter(0).isChecked())){
            await this.toggleComplianceFilter(0)
        }
        if ((filters.complied && !await this.getFilter(1).isChecked()) || (!filters.complied && await this.getFilter(1).isChecked())){
            await this.toggleComplianceFilter(1)
        }
        if ((filters.not_complied && !await this.getFilter(2).isChecked()) || (!filters.not_complied && await this.getFilter(2).isChecked())){
            await this.toggleComplianceFilter(2)
        }
        await this.page.getByRole('button', {name: 'Apply filters'}).click()
    }

    async goTo(crn?: string){
       await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/activity-log/${this.view === "default" ? "" : `?view=${this.view}`}`)
    }

    async changeView(){
        if (this.view === "default"){
            this.clickLink("Compact view")
            this.view = "compact"
        } else {
            this.clickLink("Default view")
            this.view = "default"
        }
    }

    async checkAvailable(): Promise<boolean> {
        try {
            await expect(this.getClass('govuk-table__cell govuk-!-width-one-quarter').first()).toHaveText('Today', {timeout: 1000})
            for (const entry of await this.getClass('govuk-details', this.getTimelineCard(1)).filter({hasText: 'Online probation check in'}).all()){
                try {
                    await entry.click()
                    await expect(this.getClass('govuk-details__text', entry)).toContainText('Check in status: Missed', {timeout: 1000})
                    return false
                } catch {
                    continue
                }
            }
            return true
        } catch {
            return true
        }
    }

    getTimelineCard(id: number){
        return this.getQA(`timeline${id}Card`)
    }

    async fillText(qa: string, text: string){
       await this.getQA(qa).locator('[type="text"]').fill(text)
    }

    getFilter(id:number){
        return this.getClass("govuk-checkboxes__item", this.getQA("compliance")).nth(id).getByRole("checkbox")
    }

    async toggleComplianceFilter(id: number){
        const filter = this.getFilter(id)
        if (await filter.isChecked()){
            await filter.uncheck()
        } else {
        await filter.check()
        }
    }

    async navigateTo(crn?: string) {
        await caseNavigation(this.page, (crn ?? this.crn)!, "activityLogTab")
    }
}