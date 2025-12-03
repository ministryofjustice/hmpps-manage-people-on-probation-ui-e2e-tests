import { Page } from "@playwright/test";
import MPopPage from "../page";
import { MpopDateTime } from "../../navigation/create-appointment";
import LocationDateTimePage from "./location-datetime.page";
import SupportingInformationPage from "./supporting-information.page";

export default class ArrangeAnotherPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Arrange another appointment")
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