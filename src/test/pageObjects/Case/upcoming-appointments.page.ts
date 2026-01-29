import { Page } from "@playwright/test";
import CasePage from "./casepage";

export default class CaseUpcomingAppointmentsPage extends CasePage {
    constructor(page: Page, crn?: string) {
        super(page, "", crn)
    }

    async goTo(crn?: string){
       await this.page.goto(`https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/${(crn ?? this.crn)!}/upcoming-appointments/`)
    }

    async checkOnPage(){
        await this.checkQA("upcomingAppointments", "All upcoming appointments")
    }

    async selectAppointment(id: number, byName: boolean){
        const tableqa = "upcomingAppiointments"
        const column = byName ? "Type" : "Action"
        const cellqa = `upcomingAppointment${column}${id}`
        await this.clickTableLink(tableqa, cellqa)
    }
}