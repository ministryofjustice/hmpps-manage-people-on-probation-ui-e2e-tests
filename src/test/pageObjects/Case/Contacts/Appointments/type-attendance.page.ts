import { Page } from "@playwright/test";
import SentencePage from "./sentence.page";
import ContactPage from "../contactpage";
import { MpopAttendee } from "../../../../utilities/ArrangeAppointment";

export default class TypeAttendancePage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Appointment type and attendance", crn, uuid)
    }

    async completePage(id: number, attendee?: MpopAttendee, isVisor?: boolean) {
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