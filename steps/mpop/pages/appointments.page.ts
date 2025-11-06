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
}