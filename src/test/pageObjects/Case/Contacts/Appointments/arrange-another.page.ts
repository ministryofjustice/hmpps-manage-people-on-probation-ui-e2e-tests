import { Page } from "@playwright/test";
import LocationDateTimePage from "./location-datetime.page";
import SupportingInformationPage from "./supporting-information.page";
import ContactPage from "../contactpage";
import { MpopDateTime } from "../../../../util/DateTime";

export default class ArrangeAnotherPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Arrange another appointment", crn, uuid)
    }

    async completePage(dateTime: MpopDateTime, sensitivity: boolean, note?: string) {
        await this.clickLink('Choose date and time')
        const dateTimePage = new LocationDateTimePage(this.page)
        await dateTimePage.completePage(dateTime)
        const supportingInformationPage = new SupportingInformationPage(this.page)
        await supportingInformationPage.completePage(sensitivity, note)
        await this.submit()
    }
}