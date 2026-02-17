import { Page } from "@playwright/test";
import LocationDateTimePage from "./location-datetime.page";
import SupportingInformationPage from "./supporting-information.page";
import ContactPage from "../contactpage";
import { MpopDateTime } from "../../../../util/DateTime";
import TextConfirmationPage from "./text-confirmation-page";
import { MpopAppointmentChanges } from "../../../../util/ArrangeAppointment";

export default class ArrangeAnotherPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Arrange another appointment", crn, uuid)
    }

    async completePage(changes: MpopAppointmentChanges) {
        await this.clickLink('Choose date and time')
        const dateTimePage = new LocationDateTimePage(this.page)
        await dateTimePage.completePage(changes.dateTime)
        const textConfirmationPage = new TextConfirmationPage(this.page)
        await textConfirmationPage.completePage(changes.text!, changes.mobile)
        const supportingInformationPage = new SupportingInformationPage(this.page)
        await supportingInformationPage.completePage(changes.sensitivity!, changes.note)
        await this.submit()
    }
}