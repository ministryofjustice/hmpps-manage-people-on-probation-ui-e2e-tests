import { Page } from "@playwright/test";
import TypeAttendancePage from "./type-attendance.page";
import ContactPage from "../contactpage";
import { MpopAttendee } from "../../../../utilities/ArrangeAppointment";

export default class AttendancePage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Who will attend the appointment?", crn, uuid)
    }

    async completePage(attendee: MpopAttendee) {
        if (attendee.provider){
            await this.selectOption("providerCode", attendee.provider)
        }
        if (attendee.team){
            await this.selectOption("teamCode", attendee.team)
        }
        if (attendee.user){
            await this.selectOption("username", attendee.user)
        }
        await this.submit()
    }

    async testBacklink(change: boolean) {
        await this.clickBackLink()
        if (change){
            //change case
        }else{
            const typeAttendancePage = new TypeAttendancePage(this.page)
            await typeAttendancePage.clickLink('change')
        }
        await this.checkOnPage()
    }
}