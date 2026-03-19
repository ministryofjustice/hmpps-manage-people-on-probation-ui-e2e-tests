import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { caseNavigation } from "../../util/Navigation";
import { ContactFilters } from "../../util/Contacts";
import { DocFilters } from "../../util/Documents";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class DocumentsPage extends CasePage {

    constructor(page: Page, crn?: string) {
        super(page, "Documents", crn)
    }

    async applyFilters(filters: DocFilters){
        if (filters.keywords){
            await this.fillText('query', filters.keywords)
        }
        if (filters.level){
            await this.getQA('documentLevel').getByLabel('Document level').selectOption(filters.level)
        }
        if (filters.from){
            await this.fillText('dateFrom', filters.from)
        }
        if (filters.to){
            await this.fillText('dateTo', filters.to)
        }

        await this.page.getByRole('button', {name: 'Apply filters'}).click()
    }

    getTimelineCard(id: number){
        return this.getQA(`timeline${id}Card`)
    }

    async fillText(qa: string, text: string){
       await this.getQA(qa).getByRole('textbox').fill(text)
    }

    async navigateTo(crn?: string) {
        await caseNavigation(this.page, (crn ?? this.crn)!, "documentsTab")
    }

    async getCount(): Promise<number>{
        try {
            const text = await this.getQA('pagination').textContent()
            const count = text?.match(/\d+(,\d+)*/g) as unknown as number[]
            return parseInt(count[2].toString().replace(/\,/g,''),10)
        } catch {
            const count = await this.getClass('govuk-table__row').count()
            return count-1
        }
    }
}