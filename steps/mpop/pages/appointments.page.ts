import { expect, Page } from "@playwright/test";
import MPopPage from "./page";
import * as dotenv from 'dotenv'
import SentencePage from "./appointments/sentence.page";
import CaseUpcomingAppointmentsPage from "./appointments/upcoming-appointments.page";
import ActivityLogPage from "./activity-log.page";

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

    async startArrangeAppointment(): Promise<SentencePage> {
        await this.getQA('arrange-appointment-btn').click()
        return new SentencePage(this.page)
    }

    async viewUpcomingAppointments(): Promise<CaseUpcomingAppointmentsPage> {
        await this.clickLink("View all upcoming appointments")
        return new CaseUpcomingAppointmentsPage(this.page)
    }

    async viewPastAppointments(): Promise<ActivityLogPage> {
        await this.clickLink("View all past appointments in the activity log")
        return new ActivityLogPage(this.page)
    }

    async selectAppointment(upcoming: boolean, id: number, byName: boolean){
        const tableqa = upcoming ? "upcomingAppointments" : "pastAppointments"
        const table = upcoming ? "upcoming" : "past"
        const column = byName ? "Type" : "Action"
        const cellqa = `${table}Appointment${column}${id}`
        await this.clickTableLink(tableqa, cellqa)
    }
}