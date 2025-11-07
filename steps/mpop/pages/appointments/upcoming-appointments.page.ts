import { expect, Page } from "@playwright/test";
import MPopPage from "../page";

export default class caseUpcomingAppointmentsPage extends MPopPage {
    constructor(page: Page) {
        super(page, "")
    }

    async goTo(crn: string){
       await this.page.goto(`https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/${crn}/upcoming-appointments/`)
    }

    async checkOnPage(){
        await this.checkQA("upcomingAppointments", "All upcoming appointments")
    }

    async selectAppointment(id: number, byName: boolean){
        const tableqa = "upcomingAppiointments"
        const column = byName ? "Type" : "Action"
        const cellqa = `upcomingAppointment${column}${id}`
        await this.tableLink(tableqa, cellqa)
    }
}