import { Page } from "@playwright/test";
import LocationDateTimePage from "./location-datetime.page";
import SupportingInformationPage from "./supporting-information.page";
import ContactPage from "../contactpage";
import { MpopDateTime, today } from "../../../../util/DateTime";
import TextConfirmationPage from "./text-confirmation-page";
import { MpopAppointmentChanges } from "../../../../util/ArrangeAppointment";
import { DateTime } from "luxon";
import AttendedCompliedPage from "./attended-complied.page";
import AddNotePage from "./add-note.page";

export default class ArrangeAnotherPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Arrange another appointment", crn, uuid)
    }

    async completePage(changes: MpopAppointmentChanges) {
        const past = DateTime.fromFormat(changes.dateTime!.date, "d/M/yyyy")  < today
        await this.clickLink('Choose date and time')
        const dateTimePage = new LocationDateTimePage(this.page)
        await dateTimePage.completePage(changes.dateTime)
        if (past){
            console.log('past appointment')
            const attendedCompliedPage = new AttendedCompliedPage(this.page)
            await attendedCompliedPage.assertOnPage()
            await attendedCompliedPage.completePage()
            const addNotePage = new AddNotePage(this.page)
            await addNotePage.assertOnPage()
            await addNotePage.completePage(changes.sensitivity!, changes.note!)//file
        } else {
            const textConfirmationPage = new TextConfirmationPage(this.page)
            await textConfirmationPage.completePage(changes.text!, changes.mobile)
            const supportingInformationPage = new SupportingInformationPage(this.page)
            await supportingInformationPage.completePage(changes.sensitivity!, changes.note)
        }
        await this.submit()
    }
}