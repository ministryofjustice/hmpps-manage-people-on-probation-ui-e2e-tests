import { expect, Page } from "@playwright/test";
import MPopPage from "./page";

export default class ActivityLogPage extends MPopPage {
    view : string = "default"

    constructor(page: Page, view: string = "default") {
        super(page, "Activity log")
        this.view = view
    }

    async goTo(crn: string){
       await this.page.goto(`https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/${crn}/activity-log/${this.view === "default" ? "" : `?view=${this.view}`}`)
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
        if (filter.isChecked()){
            await filter.uncheck()
        } else {
        await filter.check()
        }
    }

    
}