import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { caseNavigation } from "../../util/Navigation";
import { ContactFilters } from "../../util/Contacts";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class ActivityLogPage extends CasePage {

    constructor(page: Page, crn?: string) {
        super(page, "Contacts", crn)
    }

    async applyFilters(filters: ContactFilters){
        const complianceGroup = this.page.getByRole('group', { name: 'Compliance filters' })
        const categoryGroup = this.page.getByRole('group', { name: 'Category filters' })

        if (filters.keywords){
            await this.fillText('keywords', filters.keywords)
        }
        if (filters.from){
            await this.fillText('date-from', filters.from)
        }
        if (filters.to){
            await this.fillText('date-to', filters.to)
        }

        for (const label of filters.compliance_filters) {
            if (!label || label === 'NaN') {
                throw new Error(`Invalid compliance filter value: ${label}`)
            }
            await complianceGroup.getByLabel(label, { exact: true }).check()
        }

        for (const label of filters.category_filters) {
            if (!label || label === 'NaN') {
                throw new Error(`Invalid category filter value: ${label}`)
            }
            await categoryGroup.getByLabel(label, { exact: true }).check()
        }
        // for (let i=0; i<filters.compliance_filters.length; i++){
        //     await this.toggleFilter(filters.compliance_filters[i]-1, 'compliance')
        // }
        // for (let i=0; i<filters.category_filters.length; i++){
        //     await this.toggleFilter(filters.category_filters[i]-1, 'category')
        // }
        await this.page.getByRole('button', {name: 'Apply filters'}).click()
        if (filters.hide_system_generated){
            await this.toggleFilter(0, 'hideContact')
            await this.getQA('submit-apply-button').click()
        }
    }

    async checkAvailable(): Promise<boolean> {
        try {
            await expect(this.getClass('govuk-table__cell govuk-!-width-one-quarter').first()).toHaveText('Today')
            for (const entry of await this.getClass('govuk-details', this.getTimelineCard(1)).filter({hasText: 'Online probation check in'}).all()){
                try {
                    await entry.click()
                    await expect(this.getClass('govuk-details__text', entry)).toContainText('Check in status: Missed')
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

    getFilter(id: number, qa: string){
        return this.getClass("govuk-checkboxes__item", this.getQA(qa)).nth(id).getByRole("checkbox")
    }

    async toggleFilter(id: number, qa: string){
        const filter = this.getFilter(id,qa)
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