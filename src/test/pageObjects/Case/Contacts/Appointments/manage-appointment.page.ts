import { expect, Page } from "@playwright/test";
import ContactPage from "../contactpage";
import { MPOP_URL } from "../../../../utilities/Data";

export enum ManageAction {
  AttendedComplied = 0,
  Notes = 1,
  Next = 2
}

export default class ManageAppointmentsPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Manage", crn, uuid)
    }

    async goTo(crn?: string, contactId?: string){
       await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/appointments/appointment/${(contactId ?? this.uuid)!}/manage`)
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