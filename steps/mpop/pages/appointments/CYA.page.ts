import { expect, Page } from "@playwright/test";
import MPopPage from "../page";
import { mpopAttendee } from "../../appointments/create-appointment";
import AttendancePage from "./attendance.page";
import SentencePage from "./sentence.page";

export default class CYAPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Check your answers then confirm the appointment")
    }

    async completePage(isVisor?: boolean) {
        await this.checkSummaryRowKey(0, "Appointment for")
        await this.checkSummaryRowKey(1, "Appointment type")
        let count = 2
        if (isVisor != undefined){
            await this.checkSummaryRowKey(2,"VISOR report")
            count += 1
        }
        await this.checkSummaryRowKey(count,"Attending")
        await this.checkSummaryRowKey(count+1, "Location")
        await this.checkSummaryRowKey(count+2, "Date and time")
        await this.checkSummaryRowKey(count+3, "Supporting information")
        await this.checkSummaryRowKey(count+4, "Sensitivity")
        await this.submit()
    }

    async checkSummaryRowKey(id: number, value: string){
        await expect(this.page.locator('[class="govuk-summary-list__key"]').nth(id)).toContainText(value)
    }
}