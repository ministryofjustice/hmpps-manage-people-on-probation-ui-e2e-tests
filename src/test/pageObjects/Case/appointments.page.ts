import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import { caseNavigation } from "../../util/Navigation";
import CasePage from "./casepage";
import { MpopArrangeAppointment } from "../../util/ArrangeAppointment";
import { DateTime } from "luxon";
import { mpopLongMonthFormat, mpopTime, today } from "../../util/DateTime";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class AppointmentsPage extends CasePage{
    constructor(page: Page, crn?: string) {
        super(page, undefined, crn)
    }

    async goTo(crn?: string){
       await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/appointments/`)
    }

    async checkOnPage(){
        await this.checkQA("upcomingAppointments", "Upcoming appointments")
        await this.checkQA("appointmentHistory", "Appointment history")
    }

    async startArrangeAppointment() {
        await this.getQA('arrange-appointment-btn').click()
    }

    async viewUpcomingAppointments() {
        await this.clickLink("View all upcoming appointments")
    }

    async viewPastAppointments() {
        await this.clickLink("View all past appointments in the contacts page")
    }

    async selectPastAppointment(id: number) {
        await this.selectAppointment(false, id, true)
    }

    async selectFutureAppointment(id: number){
        await this.selectAppointment(true, id, true)
    }

    async selectAppointment(upcoming: boolean, id: number, byName: boolean = false){
        const tableqa = upcoming ? "upcomingAppointmentsSection" : "pastAppointmentsSection"
        const table = upcoming ? "upcoming" : "past"
        const column = byName ? "Type" : "Action"
        const cellqa = `${table}Appointment${column}${id}`
        await this.clickTableLink(tableqa, cellqa)
    }

    async navigateTo(crn?: string){
        await caseNavigation(this.page, (crn ?? this.crn)!, "appointmentsTab")
    }

    async checkSetupCheckIns(){
        await this.checkQA("online-checkin-btn", "Set up online check ins");
    }

    async clickSetupOnlineCheckInsBtn() {
        const btn = this.getQA("online-checkin-btn")
        await expect(btn).toBeVisible({ timeout: 10000 })  // ensure visible
        await btn.click()
    }

    async manageAppointment(appointment: MpopArrangeAppointment){
        const dateTime = DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy")
        const date = dateTime.toFormat('d MMMM yyyy')
        const time = mpopTime(appointment.dateTime.startTime, appointment.dateTime.endTime)
        console.log(date)
        console.log(time)
        const row = this.getClass('govuk-table__row').filter({hasText: date}).filter({hasText: time})
        await row.getByRole('link', {name: 'Manage'}).click()
    }
}