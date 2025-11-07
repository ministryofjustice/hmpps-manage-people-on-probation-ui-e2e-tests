import { expect, Page } from "@playwright/test";
import MPopPage from "./page";

export default class AppointmentsPage extends MPopPage {
    constructor(page: Page) {
        super(page)
    }

    async goTo(crn: string){
       await this.page.goto(`https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/${crn}/appointments/`)
    }

    async checkOnPage(){
        await this.checkQA("upcomingAppointments", "Upcoming appointments")
        await this.checkQA("appointmentHistory", "Appointment history")
    }

    async startArrangeAppointment(){
        await this.page.locator('[data-qa="arrange-appointment-btn"]').click()
    }

    async viewUpcomingAppointments(){
        await this.clickLink("View all upcoming appointments")
    }

    async viewPastAppointments(){
        await this.clickLink("View all past appointments in the activity log")
    }

    async selectAppointment(upcoming: boolean, id: number, byName: boolean){
        const tableqa = upcoming ? "upcomingAppiointments" : "pastAppointments"
        const table = upcoming ? "upcoming" : "past"
        const column = byName ? "Type" : "Action"
        const cellqa = `${table}Appointment${column}${id}`
        await this.tableLink(tableqa, cellqa)
    }
}