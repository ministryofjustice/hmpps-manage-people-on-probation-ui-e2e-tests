import { expect, Page } from "@playwright/test";
import MPopPage from "../page";

export default class ManageAppointmentsPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Manage")
    }

    async goTo(crn: string, contactId: string){
       await this.page.goto(`https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/${crn}/appointments/appointment/${contactId}/manage`)
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

    async checkActionLink(id: number, value: string){
        await expect(this.getQA("appointmentActions").getByRole("listitem").nth(id).getByRole("link")).toHaveText(value)
    }
}