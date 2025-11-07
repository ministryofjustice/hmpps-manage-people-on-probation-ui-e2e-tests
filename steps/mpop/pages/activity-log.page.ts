import { expect, Page } from "@playwright/test";
import MPopPage from "./page";

export default class ActivityLogPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Activity log")
    }

    async goTo(crn: string){
       await this.page.goto(`https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/${crn}/activity-log/`)
    }
}