import { Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { caseNavigation } from "../../utilities/Navigation";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class ActivityLogPage extends CasePage {
    view : string = "default"

    constructor(page: Page, view: string = "default", crn?: string) {
        super(page, "Contacts", crn)
        this.view = view
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

    getTimelineCard(id: number){
        return this.getQA(`timeline${id}Card`)
    }

    async fillText(qa: string, text: string){
       await this.getQA(qa).locator('[type="text"]').fill(text)
    }

    async toggleComplianceFilter(id: number){
        const filter = this.getClass("govuk-checkboxes__item", this.getQA("compliance")).nth(id).getByRole("checkbox")
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