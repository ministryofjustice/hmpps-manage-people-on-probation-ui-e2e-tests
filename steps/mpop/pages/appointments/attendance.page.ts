import { Page } from "@playwright/test";
import MPopPage from "../page";
import { MpopAttendee } from "../../navigation/create-appointment";
import TypeAttendancePage from "./type-attendance.page";

export default class AttendancePage extends MPopPage {
    constructor(page: Page) {
        super(page, "Who will attend the appointment?")
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