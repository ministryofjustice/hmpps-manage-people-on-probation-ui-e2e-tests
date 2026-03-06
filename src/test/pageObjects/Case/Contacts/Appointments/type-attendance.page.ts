import { Page } from "@playwright/test";
import SentencePage from "./sentence.page";
import ContactPage from "../contactpage";
import { MpopAttendee } from "../../../../util/ArrangeAppointment";

export default class TypeAttendancePage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Appointment type and attendance", crn, uuid)
    }

    async changePage(id?: number, attendee?: MpopAttendee, isVisor?: boolean) {
        if (id != undefined){
            await this.clickRadio("type", id)
        }
        if (isVisor != undefined){
            await this.clickRadio("visorReport", isVisor ? 0 : 1)
        }
        //attendee page not inclue yet?
        await this.submit()
    }

    async completePage(id: number, attendee?: MpopAttendee, isVisor?: boolean) {
        await this.changePage(id, attendee, isVisor)
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