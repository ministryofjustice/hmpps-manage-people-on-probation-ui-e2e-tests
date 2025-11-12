import { expect, Page } from "@playwright/test";
import MPopPage from "./page";
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class AppointmentsPage extends MPopPage {
    constructor(page: Page) {
        super(page)
    }

    async goTo(crn: string){
       await this.page.goto(`${MPOP_URL}/case/${crn}/appointments/`)
    }

    async checkOnPage(){
        await this.checkQA("upcomingAppointments", "Upcoming appointments")
        await this.checkQA("appointmentHistory", "Appointment history")
    }

    async startArrangeAppointment(){
        await this.getQA('arrange-appointment-btn').click()
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
        await this.clickTableLink(tableqa, cellqa)
    }
}