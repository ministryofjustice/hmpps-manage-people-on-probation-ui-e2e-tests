import { expect, Page } from "@playwright/test";
import MPopPage from "../page";
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export enum ManageAction {
  AttendedComplied = 0,
  Notes = 1,
  Next = 2
}

export default class ManageAppointmentsPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Manage")
    }

    async goTo(crn: string, contactId: string){
       await this.page.goto(`${MPOP_URL}/case/${crn}/appointments/appointment/${contactId}/manage`)
    }

    async clickNdeliusLink(){
        await this.clickLink("use NDelius to log non-attendance or non-compliance (opens in new tab)")
    }

    async clickAttendedAndCompliedLink(){
        await this.clickLink("Log attended and complied appointment")
    }

    async clickAddNotesLink(){
        await this.clickLink("Add appointment notes")
    }

    async clickNextAppointmentLink(){
        await this.clickLink("Arrange next appointment")
    }

    async checkActionLink(id: ManageAction, value: string){
        await expect(this.getQA("appointmentActions").getByRole("listitem").nth(id).getByRole("link")).toHaveText(value)
    }
}