import { Page } from "@playwright/test";
import MPopPage from "../page";
import { MpopAttendee } from "../../navigation/create-appointment";
import AttendancePage from "./attendance.page";
import SentencePage from "./sentence.page";

export default class TypeAttendancePage extends MPopPage {
    constructor(page: Page) {
        super(page, "Appointment type and attendance")
    }

    async completePage(id: number, attendee?: MpopAttendee, isVisor?: boolean) {
        if (attendee != undefined){
            await this.clickLink('change')
            const attendancePage = new AttendancePage(this.page)
            await attendancePage.completePage(attendee)
        }
        await this.clickRadio("type", id)
        if (isVisor != undefined){
            await this.clickRadio("visorReport", isVisor ? 0 : 1)
        }
        await this.submit()
    }

    async testBacklink(change: boolean) {
        await this.clickBackLink()
        if (change){
            //change case
        }else{
            const sentencePage = new SentencePage(this.page)
            sentencePage.submit()
        }
        await this.checkOnPage()
    }
}